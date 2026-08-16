const pool = require("../config/database");

async function findByEmail(email) {

    const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    );

    return rows[0];

}

async function create(user) {

    const [result] = await pool.query(

        `INSERT INTO usuarios
        (nombre,email,password,rol)
        VALUES (?,?,?,?)`,

        [
            user.nombre,
            user.email,
            user.password,
            user.rol || "CONSULTA"
        ]

    );

    return {

        id: result.insertId,

        nombre: user.nombre,

        email: user.email,

        rol: user.rol || "CONSULTA"

    };

}

module.exports = {

    findByEmail,

    create

};