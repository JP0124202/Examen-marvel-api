const tablaService=require("../services/tabla.service");

const response=require("../utils/response");

async function getTabla(req,res){

try{

const tabla=await tablaService.getTabla(

req.params.grupo

);

return response.success(

res,

"Tabla de posiciones.",

tabla

);

}

catch(error){

return response.error(

res,

error.message,

500

);

}

}

module.exports={

getTabla

};