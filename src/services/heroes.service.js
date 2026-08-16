const pool = require('../config/database');

const validStates = ['ACTIVO', 'INACTIVO'];

async function getAll() {
  const [rows] = await pool.query('SELECT id, nombre, nombre_real, poder_principal, nivel_poder, imagen_url, estado, created_at, updated_at FROM superheroes');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT id, nombre, nombre_real, poder_principal, nivel_poder, imagen_url, estado, created_at, updated_at FROM superheroes WHERE id = ?', [id]);
  return rows[0];
}

async function create(payload) {
  const { nombre, nombre_real, poder_principal, nivel_poder, imagen_url, estado } = payload;
  if (!nombre) throw { status: 400, message: 'El nombre es obligatorio' };
  if (!nombre_real) throw { status: 400, message: 'El nombre real es obligatorio' };
  if (!poder_principal) throw { status: 400, message: 'El poder principal es obligatorio' };
  if (nivel_poder == null) throw { status: 400, message: 'El nivel de poder es obligatorio' };
  const nivel = Number(nivel_poder);
  if (isNaN(nivel) || nivel < 1 || nivel > 100) throw { status: 400, message: 'El nivel de poder debe estar entre 1 y 100' };
  if (!validStates.includes(estado)) throw { status: 400, message: 'Estado inválido' };

  const [existing] = await pool.query('SELECT id FROM superheroes WHERE nombre = ?', [nombre]);
  if (existing.length) throw { status: 409, message: 'El superhéroe ya existe' };

  const [result] = await pool.query(
    'INSERT INTO superheroes (nombre, nombre_real, poder_principal, nivel_poder, imagen_url, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [nombre, nombre_real, poder_principal, nivel, imagen_url || null, estado]
  );
  return result;
}

async function update(id, payload) {
  const hero = await getById(id);
  if (!hero) return null;

  const { nombre, nombre_real, poder_principal, nivel_poder, imagen_url, estado } = payload;
  if (!nombre) throw { status: 400, message: 'El nombre es obligatorio' };
  if (!nombre_real) throw { status: 400, message: 'El nombre real es obligatorio' };
  if (!poder_principal) throw { status: 400, message: 'El poder principal es obligatorio' };
  if (nivel_poder == null) throw { status: 400, message: 'El nivel de poder es obligatorio' };
  const nivel = Number(nivel_poder);
  if (isNaN(nivel) || nivel < 1 || nivel > 100) throw { status: 400, message: 'El nivel de poder debe estar entre 1 y 100' };
  if (!validStates.includes(estado)) throw { status: 400, message: 'Estado inválido' };

  // check unique name if changed
  if (nombre !== hero.nombre) {
    const [existing] = await pool.query('SELECT id FROM superheroes WHERE nombre = ? AND id <> ?', [nombre, id]);
    if (existing.length) throw { status: 409, message: 'El nombre ya está en uso' };
  }

  await pool.query(
    'UPDATE superheroes SET nombre=?, nombre_real=?, poder_principal=?, nivel_poder=?, imagen_url=?, estado=?, updated_at=NOW() WHERE id=?',
    [nombre, nombre_real, poder_principal, nivel, imagen_url || null, estado, id]
  );
  return true;
}

async function remove(id) {
  const hero = await getById(id);
  if (!hero) return null;
  // Do not cascade delete missions; rely on DB constraints
  const [res] = await pool.query('DELETE FROM superheroes WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
