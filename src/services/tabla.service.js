const tablaModel=require("../models/tabla.model");

async function getTabla(grupo){

return await tablaModel.getTabla(grupo);

}

module.exports={

getTabla

};