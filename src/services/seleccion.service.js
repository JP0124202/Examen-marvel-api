const seleccionModel = require("../models/seleccion.model");

async function getAll() {

    return await seleccionModel.findAll();

}

async function getById(id) {

    const seleccion = await seleccionModel.findById(id);

    if (!seleccion) {

        throw new Error("Selección no encontrada.");

    }

    return seleccion;

}

async function create(data) {

    const exists = await seleccionModel.findByName(data.nombre);

    if (exists) {
        throw new Error("Ya existe una selección con ese nombre.");
    }

    return await seleccionModel.create(data);

}

async function update(id, data) {

    const seleccion = await seleccionModel.findById(id);

    if (!seleccion) {

        throw new Error("Selección no encontrada.");

    }

    const existe = await seleccionModel.findByNameExceptId(

        data.nombre,

        id

    );

    if (existe) {

        throw new Error("Ya existe una selección con ese nombre.");

    }

    return await seleccionModel.update(id, data);

}

async function remove(id) {

    const seleccion = await seleccionModel.findById(id);

    if (!seleccion) {

        throw new Error("Selección no encontrada.");

    }

    await seleccionModel.remove(id);

}

module.exports = {

    getAll,

    getById,

    create,

    update,

    remove

};