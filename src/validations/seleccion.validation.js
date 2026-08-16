const { body } = require("express-validator");

const createSeleccionValidation = [

    body("nombre")
        .notEmpty()
        .withMessage("El nombre es obligatorio."),

    body("continente")
        .notEmpty()
        .withMessage("El continente es obligatorio."),

    body("grupo")
        .notEmpty()
        .isLength({ min: 1, max: 1 })
        .withMessage("Grupo inválido."),

    body("ranking_fifa")
        .isNumeric()
        .withMessage("El ranking debe ser numérico."),

    body("entrenador")
        .notEmpty()
        .withMessage("El entrenador es obligatorio.")

];

module.exports = {
    createSeleccionValidation
};