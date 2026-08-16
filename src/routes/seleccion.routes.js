const express = require("express");

const router = express.Router();

const controller = require("../controllers/seleccion.controller");

const authenticateToken = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const validate = require("../middlewares/validation.middleware");

const {
    createSeleccionValidation
} = require("../validations/seleccion.validation");

/**
 * @swagger
 * tags:
 *   name: Selecciones
 *   description: Gestión de selecciones
 */

/**
 * @swagger
 * /api/selecciones:
 *   get:
 *     summary: Obtener todas las selecciones
 *     tags: [Selecciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de selecciones
 */
router.get(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "CONSULTA"),
    controller.getAll
);

/**
 * @swagger
 * /api/selecciones/{id}:
 *   get:
 *     summary: Obtener una selección por ID
 *     tags: [Selecciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Selección encontrada
 *       404:
 *         description: No encontrada
 */
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "CONSULTA"),
    controller.getById
);

/**
 * @swagger
 * /api/selecciones:
 *   post:
 *     summary: Crear una selección
 *     tags: [Selecciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               continente:
 *                 type: string
 *               grupo:
 *                 type: string
 *               ranking_fifa:
 *                 type: integer
 *               entrenador:
 *                 type: string
 *     responses:
 *       201:
 *         description: Selección creada
 */
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createSeleccionValidation,
    validate,
    controller.create
);

/**
 * @swagger
 * /api/selecciones/{id}:
 *   put:
 *     summary: Actualizar una selección
 *     tags: [Selecciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la selección
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               continente:
 *                 type: string
 *               grupo:
 *                 type: string
 *               ranking_fifa:
 *                 type: integer
 *               entrenador:
 *                 type: string
 *     responses:
 *       200:
 *         description: Selección actualizada correctamente
 *       404:
 *         description: Selección no encontrada
 */
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createSeleccionValidation,
    validate,
    controller.update
);

/**
 * @swagger
 * /api/selecciones/{id}:
 *   delete:
 *     summary: Eliminar una selección
 *     tags: [Selecciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la selección
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Selección eliminada correctamente
 *       404:
 *         description: Selección no encontrada
 */
router.delete(

    "/:id",

    authenticateToken,

    authorizeRoles("ADMIN"),

    controller.remove

);



module.exports = router;