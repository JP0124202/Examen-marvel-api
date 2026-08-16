const express = require("express");

const router = express.Router();

const controller = require("../controllers/partido.controller");

const authenticateToken = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const validate = require("../middlewares/validation.middleware");

const {
    createPartidoValidation,
    updateResultadoValidation
} = require("../validations/partido.validation");


/**
 * @swagger
 * tags:
 *   name: Partidos
 *   description: Gestión de partidos
 */

/**
 * @swagger
 * /api/partidos:
 *   get:
 *     summary: Obtener todos los partidos
 *     tags: [Partidos]
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
 * /api/partidos/{id}:
 *   get:
 *     summary: Obtener partido por ID
 *     tags: [Partidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del partido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Partido encontrado
 *       404:
 *         description: Partido no encontrado
 */
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "CONSULTA"),
    controller.getById
);

/**
 * @swagger
 * /api/partidos/fase/{fase}:
 *   get:
 *     summary: Obtener partidos por fase
 *     tags: [Partidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fase
 *         required: true
 *         description: Fase del torneo
 *         schema:
 *           type: string
 *           example: GRUPOS
 *     responses:
 *       200:
 *         description: Listado de partidos por fase
 *       404:
 *         description: No se encontraron partidos
 */
router.get(
    "/fase/:fase",
    authenticateToken,
    authorizeRoles("ADMIN", "CONSULTA"),
    controller.getByFase
);

/**
 * @swagger
 * /api/partidos:
 *   post:
 *     summary: Registrar un nuevo partido
 *     tags: [Partidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seleccion_local_id:
 *                 type: integer
 *                 example: 1
 *               seleccion_visitante_id:
 *                 type: integer
 *                 example: 2
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20 18:00:00"
 *               estadio:
 *                 type: string
 *                 example: Estadio Azteca
 *               fase:
 *                 type: string
 *                 enum:
 *                   - GRUPOS
 *                   - OCTAVOS
 *                   - CUARTOS
 *                   - SEMIFINAL
 *                   - FINAL
 *               goles_local:
 *                 type: integer
 *                 example: 0
 *               goles_visitante:
 *                 type: integer
 *                 example: 0
 *               estado:
 *                 type: string
 *                 enum:
 *                   - PROGRAMADO
 *                   - EN_JUEGO
 *                   - FINALIZADO
 *     responses:
 *       201:
 *         description: Partido registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 */
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createPartidoValidation,
    validate,
    controller.create
);

/**
 * @swagger
 * /api/partidos/{id}/resultado:
 *   put:
 *     summary: Registrar el resultado de un partido
 *     tags: [Partidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del partido
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goles_local:
 *                 type: integer
 *                 example: 2
 *               goles_visitante:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Resultado registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Partido no encontrado
 */
router.put(
    "/:id/resultado",
    authenticateToken,
    authorizeRoles("ADMIN"),
    updateResultadoValidation,
    validate,
    controller.updateResultado
);

/**
 * @swagger
 * /api/partidos/{id}:
 *   put:
 *     summary: Actualizar un partido
 *     tags: [Partidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del partido
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seleccion_local_id:
 *                 type: integer
 *               seleccion_visitante_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               estadio:
 *                 type: string
 *               fase:
 *                 type: string
 *                 enum:
 *                   - GRUPOS
 *                   - OCTAVOS
 *                   - CUARTOS
 *                   - SEMIFINAL
 *                   - FINAL
 *               goles_local:
 *                 type: integer
 *               goles_visitante:
 *                 type: integer
 *               estado:
 *                 type: string
 *                 enum:
 *                   - PROGRAMADO
 *                   - EN_JUEGO
 *                   - FINALIZADO
 *     responses:
 *       200:
 *         description: Partido actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Partido no encontrado
 */
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createPartidoValidation,
    validate,
    controller.update
);

/**
 * @swagger
 * /api/partidos/{id}:
 *   delete:
 *     summary: Eliminar un partido
 *     tags: [Partidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del partido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Partido eliminado correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Partido no encontrado
 */
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    controller.remove
);

module.exports = router;