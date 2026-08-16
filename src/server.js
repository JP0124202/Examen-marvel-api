require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {

        const connection = await pool.getConnection();

        console.log("✅ MySQL conectado correctamente");

        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📚 Swagger disponible en http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {

        console.error("❌ Error al conectar con MySQL");

        console.error(error.message);

        process.exit(1);

    }
}

startServer();