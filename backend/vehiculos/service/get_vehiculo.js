const auth = require("../utils/auth");
const util = require("../utils/util");
const bcrypt = require('bcryptjs');
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({region:'us-east-1'});

async function get_vehiculo(requestBody){
	const placa = requestBody.placa;

	if(!placa){
		return util.buildResponse(401,{"message":"Todos los campos son necesarios"});
	}
	const vehiculo = await getVehiculo(placa);
	console.log("vehiculo ",vehiculo);
	return util.buildResponse(200,vehiculo);
}

async function getVehiculo(placa){
	const input = {
		TableName: "flete_vehiculos",
		Key:{"placa":{"S":placa}},
        AttributesToGet:["placa","telefono","calficacion_promedio","correo_conductor","dimensiones","nombre_conductor","tipo_carga","tipo_transporte"]
	};
	const command = new GetItemCommand(input);
	const response = await client.send(command);
	return response;
}

module.exports.get_vehiculo = get_vehiculo;
