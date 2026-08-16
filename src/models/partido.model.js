const pool = require("../config/database");

async function findAll() {

    const [rows] = await pool.query(`
        SELECT
            p.id,
            sl.nombre AS seleccion_local,
            sv.nombre AS seleccion_visitante,
            p.fecha,
            p.estadio,
            p.fase,
            p.goles_local,
            p.goles_visitante,
            p.estado
        FROM partidos p
        INNER JOIN selecciones sl
            ON p.seleccion_local_id = sl.id
        INNER JOIN selecciones sv
            ON p.seleccion_visitante_id = sv.id
        ORDER BY p.fecha ASC
    `);

    return rows;

}

async function findById(id) {

    const [rows] = await pool.query(`
        SELECT
            p.id,
            sl.nombre AS seleccion_local,
            sv.nombre AS seleccion_visitante,
            p.fecha,
            p.estadio,
            p.fase,
            p.goles_local,
            p.goles_visitante,
            p.estado
        FROM partidos p
        INNER JOIN selecciones sl
            ON p.seleccion_local_id = sl.id
        INNER JOIN selecciones sv
            ON p.seleccion_visitante_id = sv.id
        WHERE p.id = ?
    `, [id]);

    return rows[0];

}

async function findByFase(fase) {

    const [rows] = await pool.query(`
        SELECT
            p.id,
            sl.nombre AS seleccion_local,
            sv.nombre AS seleccion_visitante,
            p.fecha,
            p.estadio,
            p.fase,
            p.goles_local,
            p.goles_visitante,
            p.estado
        FROM partidos p
        INNER JOIN selecciones sl
            ON p.seleccion_local_id = sl.id
        INNER JOIN selecciones sv
            ON p.seleccion_visitante_id = sv.id
        WHERE p.fase = ?
        ORDER BY p.fecha ASC
    `, [fase]);

    return rows;

}

async function create(data) {

    const [result] = await pool.query(

        `
        INSERT INTO partidos
        (
            seleccion_local_id,
            seleccion_visitante_id,
            fecha,
            estadio,
            fase,
            goles_local,
            goles_visitante,
            estado
        )
        VALUES
        (?,?,?,?,?,?,?,?)
        `,

        [

            data.seleccion_local_id,

            data.seleccion_visitante_id,

            data.fecha,

            data.estadio,

            data.fase,

            data.goles_local,

            data.goles_visitante,

            data.estado

        ]

    );

    return {

        id: result.insertId,

        ...data

    };

}

async function updateResultado(id, golesLocal, golesVisitante) {

    await pool.query(

        `
        UPDATE partidos
        SET

            goles_local=?,

            goles_visitante=?,

            estado='FINALIZADO'

        WHERE id=?
        `,

        [

            golesLocal,

            golesVisitante,

            id

        ]

    );

}

async function update(id, data) {

    await pool.query(
        `
        UPDATE partidos
        SET
            seleccion_local_id=?,
            seleccion_visitante_id=?,
            fecha=?,
            estadio=?,
            fase=?,
            goles_local=?,
            goles_visitante=?,
            estado=?
        WHERE id=?
        `,
        [
            data.seleccion_local_id,
            data.seleccion_visitante_id,
            data.fecha,
            data.estadio,
            data.fase,
            data.goles_local,
            data.goles_visitante,
            data.estado,
            id
        ]
    );

    return {
        id,
        ...data
    };

}

async function remove(id) {

    await pool.query(
        "DELETE FROM partidos WHERE id=?",
        [id]
    );

}
module.exports = {
    findAll,
    findById,
    findByFase,
    create,
    update,
    updateResultado,
    remove
};