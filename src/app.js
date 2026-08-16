const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const seleccionRoutes = require("./routes/seleccion.routes");
const partidoRoutes = require("./routes/partido.routes");
const tablaRoutes=require("./routes/tabla.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "World Cup API funcionando correctamente"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/selecciones", seleccionRoutes);

app.use("/api/partidos", partidoRoutes);

app.use(

"/api/grupos",

tablaRoutes

);

module.exports = app;