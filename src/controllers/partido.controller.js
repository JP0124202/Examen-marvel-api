const partidoService = require("../services/partido.service");
const response = require("../utils/response");

async function getAll(req, res) {

    try {

        const partidos = await partidoService.getAll();

        return response.success(
            res,
            "Listado de partidos.",
            partidos
        );

    } catch (error) {

        return response.error(
            res,
            error.message,
            500
        );

    }

}

async function getById(req, res) {

    try {

        const partido = await partidoService.getById(req.params.id);

        return response.success(
            res,
            "Partido encontrado.",
            partido
        );

    } catch (error) {

        return response.error(
            res,
            error.message,
            404
        );

    }

}

async function getByFase(req, res) {

    try {

        const partidos = await partidoService.getByFase(req.params.fase);

        return response.success(
            res,
            "Listado por fase.",
            partidos
        );

    } catch (error) {

        return response.error(
            res,
            error.message,
            500
        );

    }

}

async function create(req, res) {

    try {

        const partido = await partidoService.create(req.body);

        return response.success(
            res,
            "Partido registrado correctamente.",
            partido,
            201
        );

    }

    catch (error) {

        return response.error(
            res,
            error.message
        );

    }

}

async function updateResultado(req, res) {

    try {

        const partido = await partidoService.updateResultado(

            req.params.id,

            req.body

        );

        return response.success(

            res,

            "Resultado registrado correctamente.",

            partido

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

async function update(req, res) {

    try {

        const partido = await partidoService.update(
            req.params.id,
            req.body
        );

        return response.success(
            res,
            "Partido actualizado correctamente.",
            partido
        );

    } catch (error) {

        return response.error(
            res,
            error.message
        );

    }

}

async function remove(req, res) {

    try {

        await partidoService.remove(req.params.id);

        return response.success(
            res,
            "Partido eliminado correctamente."
        );

    } catch (error) {

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
    getByFase,
    create,
    update,
    updateResultado,
    remove
};