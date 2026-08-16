const seleccionService = require("../services/seleccion.service");
const response = require("../utils/response");

async function getAll(req, res) {

    try {

        const selecciones = await seleccionService.getAll();

        return res.json({
            success: true,
            data: selecciones
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function getById(req, res) {

    try {

        const seleccion = await seleccionService.getById(req.params.id);

        return res.json({
            success: true,
            data: seleccion
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

}

async function create(req, res) {

    try {

        const seleccion = await seleccionService.create(req.body);

        return response.success(
            res,
            "Selección creada correctamente.",
            seleccion,
            201
        );

    } catch (error) {

        return response.error(
            res,
            error.message
        );

    }

}

async function update(req, res) {

    try {

        const seleccion = await seleccionService.update(

            req.params.id,

            req.body

        );

        return response.success(

            res,

            "Selección actualizada correctamente.",

            seleccion

        );

    }

    catch (error) {

        return response.error(

            res,

            error.message

        );

    }

}

async function remove(req, res) {

    try {

        await seleccionService.remove(

            req.params.id

        );

        return response.success(

            res,

            "Selección eliminada correctamente."

        );

    }

    catch (error) {

        return response.error(

            res,

            error.message,

            404

        );

    }

}

module.exports = {

    getAll,

    getById,

    create,

    update,

    remove

};