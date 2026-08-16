const express=require("express");

const router=express.Router();

const controller=require("../controllers/tabla.controller");

const authenticateToken=require("../middlewares/auth.middleware");

const authorizeRoles=require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Tabla
 *   description: Tabla de posiciones
 */


/**
 * @swagger
 * /api/grupos/{grupo}/tabla:
 *   get:
 *     summary: Tabla de posiciones por grupo
 *     tags: [Tabla]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: grupo
 *         required: true
 *         description: "Grupo del mundial (ej: A, B, C)"
 *         schema:
 *           type: string
 *           example: A
 *     responses:
 *       200:
 *         description: Tabla de posiciones generada correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 */
router.get(

"/:grupo/tabla",

authenticateToken,

authorizeRoles(

"ADMIN",

"CONSULTA"

),

controller.getTabla

);

module.exports=router;