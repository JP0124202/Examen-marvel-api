const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;
    const user = await authService.register({ nombre, email, password, rol });
    res.status(201).json({ message: 'Usuario creado correctamente', data: { id: user.insertId, nombre, email, rol } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    delete user.password;
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res.json({ message: 'Sesión cerrada' });
}

module.exports = { register, login, me, logout };
