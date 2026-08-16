const pool = require('../config/database');

const validPeligro = ['BAJO', 'MEDIO', 'ALTO'];
const validEstado = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];

async function getAll() {
  const [rows] = await pool.query(
    `SELECT m.id, m.titulo, m.descripcion, m.ubicacion, m.fecha, m.nivel_peligro, m.estado, m.superheroe_id, m.created_at, m.updated_at,
      s.nombre as superheroe_nombre
      FROM misiones m
      JOIN superheroes s ON m.superheroe_id = s.id`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT m.id, m.titulo, m.descripcion, m.ubicacion, m.fecha, m.nivel_peligro, m.estado, m.superheroe_id, m.created_at, m.updated_at,
      s.nombre as superheroe_nombre
      FROM misiones m
      JOIN superheroes s ON m.superheroe_id = s.id
      WHERE m.id = ?`,
    [id]
  );
  return rows[0];
}

async function create(payload) {
  const { titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, superheroe_id } = payload;
  if (!titulo) throw { status: 400, message: 'El título es obligatorio' };
  if (!descripcion) throw { status: 400, message: 'La descripción es obligatoria' };
  if (!ubicacion) throw { status: 400, message: 'La ubicación es obligatoria' };
  if (!fecha) throw { status: 400, message: 'La fecha es obligatoria' };
  if (!validPeligro.includes(nivel_peligro)) throw { status: 400, message: 'Nivel de peligro inválido' };
  if (!validEstado.includes(estado)) throw { status: 400, message: 'Estado inválido' };
  if (!superheroe_id) throw { status: 400, message: 'El superheroe_id es obligatorio' };

  const [heroRows] = await pool.query('SELECT id FROM superheroes WHERE id = ?', [superheroe_id]);
  if (!heroRows.length) throw { status: 404, message: 'El superhéroe no existe' };

  const [result] = await pool.query(
    'INSERT INTO misiones (titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, superheroe_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, superheroe_id]
  );
  return result;
}

async function update(id, payload) {
  const mission = await getById(id);
  if (!mission) return null;
  const { titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, superheroe_id } = payload;
  if (!titulo) throw { status: 400, message: 'El título es obligatorio' };
  if (!descripcion) throw { status: 400, message: 'La descripción es obligatoria' };
  if (!ubicacion) throw { status: 400, message: 'La ubicación es obligatoria' };
  if (!fecha) throw { status: 400, message: 'La fecha es obligatoria' };
  if (!validPeligro.includes(nivel_peligro)) throw { status: 400, message: 'Nivel de peligro inválido' };
  if (!validEstado.includes(estado)) throw { status: 400, message: 'Estado inválido' };
  if (!superheroe_id) throw { status: 400, message: 'El superheroe_id es obligatorio' };

  const [heroRows] = await pool.query('SELECT id FROM superheroes WHERE id = ?', [superheroe_id]);
  if (!heroRows.length) throw { status: 404, message: 'El superhéroe no existe' };

  await pool.query(
    'UPDATE misiones SET titulo=?, descripcion=?, ubicacion=?, fecha=?, nivel_peligro=?, estado=?, superheroe_id=?, updated_at=NOW() WHERE id=?',
    [titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, superheroe_id, id]
  );
  return true;
}

async function remove(id) {
  const mission = await getById(id);
  if (!mission) return null;
  const [res] = await pool.query('DELETE FROM misiones WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
