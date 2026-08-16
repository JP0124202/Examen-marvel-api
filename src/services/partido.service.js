const partidoModel = require("../models/partido.model");
const seleccionModel = require("../models/seleccion.model");

async function getAll() {

    return await partidoModel.findAll();

}

async function getById(id) {

    const partido = await partidoModel.findById(id);

    if (!partido) {
        throw new Error("Partido no encontrado.");
    }

    return partido;

}

async function getByFase(fase) {

    return await partidoModel.findByFase(fase);

}

async function create(data) {

    if (data.seleccion_local_id === data.seleccion_visitante_id) {
        throw new Error("Una selección no puede jugar contra sí misma.");
    }

    if (
    data.estado === "PROGRAMADO" &&
    (
        Number(data.goles_local) !== 0 ||
        Number(data.goles_visitante) !== 0
    )
) {
    throw new Error(
        "Un partido PROGRAMADO debe iniciar con marcador 0 - 0."
    );
}

    const local = await seleccionModel.findById(
        data.seleccion_local_id
    );

    if (!local) {
        throw new Error("La selección local no existe.");
    }

    const visitante = await seleccionModel.findById(
        data.seleccion_visitante_id
    );

    if (!visitante) {
        throw new Error("La selección visitante no existe.");
    }

    return await partidoModel.create(data);

}

async function updateResultado(id, data) {

    const partido = await partidoModel.findById(id);

    if (!partido) {

        throw new Error("Partido no encontrado.");

    }

    await partidoModel.updateResultado(

        id,

        data.goles_local,

        data.goles_visitante

    );

    return await partidoModel.findById(id);

}

async function update(id, data) {

    const partido = await partidoModel.findById(id);

    if (!partido) {
        throw new Error("Partido no encontrado.");
    }

    if (data.seleccion_local_id === data.seleccion_visitante_id) {
        throw new Error("Una selección no puede jugar contra sí misma.");
    }

    const local = await seleccionModel.findById(data.seleccion_local_id);

    if (!local) {
        throw new Error("La selección local no existe.");
    }

    const visitante = await seleccionModel.findById(data.seleccion_visitante_id);

    if (!visitante) {
        throw new Error("La selección visitante no existe.");
    }

    if (
    data.estado === "PROGRAMADO" &&
    (
        Number(data.goles_local) !== 0 ||
        Number(data.goles_visitante) !== 0
    )
) {
    throw new Error(
        "Un partido PROGRAMADO debe iniciar con marcador 0 - 0."
    );
}

    return await partidoModel.update(id, data);

}

async function remove(id) {

    const partido = await partidoModel.findById(id);

    if (!partido) {
        throw new Error("Partido no encontrado.");
    }

    await partidoModel.remove(id);

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