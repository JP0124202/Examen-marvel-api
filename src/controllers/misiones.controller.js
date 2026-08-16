const misionesService = require('../services/misiones.service');

async function getAll(req, res, next) {
  try {
    const misiones = await misionesService.getAll();
    res.json({ data: misiones });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const mision = await misionesService.getById(id);
    if (!mision) return res.status(404).json({ error: 'Misión no encontrada' });
    res.json({ data: mision });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = req.body;
    const result = await misionesService.create(payload);
    res.status(201).json({ message: 'Misión creada correctamente', data: { id: result.insertId, ...payload } });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await misionesService.update(id, payload);
    if (!updated) return res.status(404).json({ error: 'Misión no encontrada' });
    res.json({ message: 'Misión actualizada correctamente' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await misionesService.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Misión no encontrada' });
    res.json({ message: 'Misión eliminada correctamente' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
