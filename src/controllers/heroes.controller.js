const heroesService = require('../services/heroes.service');

async function getAll(req, res, next) {
  try {
    const heroes = await heroesService.getAll();
    res.json({ data: heroes });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const hero = await heroesService.getById(id);
    if (!hero) return res.status(404).json({ error: 'Superhéroe no encontrado' });
    res.json({ data: hero });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = req.body;
    const result = await heroesService.create(payload);
    res.status(201).json({ message: 'Superhéroe creado correctamente', data: { id: result.insertId, ...payload } });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await heroesService.update(id, payload);
    if (!updated) return res.status(404).json({ error: 'Superhéroe no encontrado' });
    res.json({ message: 'Superhéroe actualizado correctamente' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await heroesService.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Superhéroe no encontrado' });
    res.json({ message: 'Superhéroe eliminado correctamente' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
