const { body } = require("express-validator");

const fases = [
    "GRUPOS",
    "OCTAVOS",
    "CUARTOS",
    "SEMIFINAL",
    "FINAL"
];

const estados = [
    "PROGRAMADO",
    "EN_JUEGO",
    "FINALIZADO"
];

const createPartidoValidation = [

    body("seleccion_local_id")
        .isInt({ min: 1 })
        .withMessage("Selección local inválida."),

    body("seleccion_visitante_id")
        .isInt({ min: 1 })
        .withMessage("Selección visitante inválida."),

    body("fecha")
        .notEmpty()
        .withMessage("La fecha es obligatoria."),

    body("estadio")
        .notEmpty()
        .withMessage("El estadio es obligatorio."),

    body("fase")
        .isIn(fases)
        .withMessage("Fase inválida."),

    body("goles_local")
        .isInt({ min: 0 })
        .withMessage("Los goles locales no pueden ser negativos."),

    body("goles_visitante")
        .isInt({ min: 0 })
        .withMessage("Los goles visitantes no pueden ser negativos."),

    body("estado")
        .isIn(estados)
        .withMessage("Estado inválido.")

];

const updateResultadoValidation = [

    body("goles_local")
        .isInt({ min: 0 })
        .withMessage("Los goles locales no pueden ser negativos."),

    body("goles_visitante")
        .isInt({ min: 0 })
        .withMessage("Los goles visitantes no pueden ser negativos.")

];

module.exports = {
    createPartidoValidation,
    updateResultadoValidation
};

