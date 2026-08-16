const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

const validRoles = ['ADMIN', 'CONSULTA'];

async function register({ nombre, email, password, rol }) {
  if (!nombre) throw { status: 400, message: 'El nombre es obligatorio' };
  if (!email) throw { status: 400, message: 'El email es obligatorio' };
  if (!password || password.length < 8) throw { status: 400, message: 'La contraseña debe tener al menos 8 caracteres' };
  if (!validRoles.includes(rol)) throw { status: 400, message: 'Rol inválido' };

  const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existing.length) throw { status: 409, message: 'El email ya está en uso' };

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password, rol, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [nombre, email, hash, rol]
  );
  return result;
}

async function login(email, password) {
  if (!email || !password) throw { status: 400, message: 'Email y contraseña son requeridos' };
  const [rows] = await pool.query('SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) throw { status: 401, message: 'Credenciales inválidas' };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Credenciales inválidas' };

  const token = signToken({ id: user.id, email: user.email, rol: user.rol });
  return { message: 'Login correcto', data: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol, token } };
}

async function getById(id) {
  const [rows] = await pool.query('SELECT id, nombre, email, rol, created_at, updated_at FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { register, login, getById };
