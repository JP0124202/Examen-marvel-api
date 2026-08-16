const pool = require("../config/database");

async function findAll() {

    const [rows] = await pool.query(`
        SELECT
            id,
            nombre,
            continente,
            grupo,
            ranking_fifa,
            entrenador
        FROM selecciones
        ORDER BY ranking_fifa ASC
    `);

    return rows;

}

async function findById(id) {

    const [rows] = await pool.query(

        `
        SELECT
            id,
            nombre,
            continente,
            grupo,
            ranking_fifa,
            entrenador
        FROM selecciones
        WHERE id = ?
        `,

        [id]

    );

    return rows[0];

}

async function findByName(nombre) {

    const [rows] = await pool.query(

        "SELECT * FROM selecciones WHERE nombre = ?",

        [nombre]

    );

    return rows[0];

}

async function create(data) {

    const [result] = await pool.query(

        `
        INSERT INTO selecciones
        (
            nombre,
            continente,
            grupo,
            ranking_fifa,
            entrenador
        )
        VALUES (?,?,?,?,?)
        `,

        [
            data.nombre,
            data.continente,
            data.grupo,
            data.ranking_fifa,
            data.entrenador
        ]

    );

    return {

        id: result.insertId,

        ...data

    };

}

async function findByNameExceptId(nombre, id) {

    const [rows] = await pool.query(

        `
        SELECT *
        FROM selecciones
        WHERE nombre = ?
        AND id <> ?
        `,

        [nombre, id]

    );

    return rows[0];

}

async function update(id, data) {

    await pool.query(

        `
        UPDATE selecciones
        SET

            nombre=?,

            continente=?,

            grupo=?,

            ranking_fifa=?,

            entrenador=?

        WHERE id=?
        `,

        [

            data.nombre,

            data.continente,

            data.grupo,

            data.ranking_fifa,

            data.entrenador,

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

        "DELETE FROM selecciones WHERE id=?",

        [id]

    );

}

module.exports = {

    findAll,

    findById,

    findByName,

    findByNameExceptId,

    create,

    update,

    remove

};