const util = require("../utils/util");
const auth = require("../utils/auth");
const { DynamoDBClient, GetItemCommand ,PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({region:'us-east-1'});

async function register_vehiculo(requestBody) {
	if(!requestBody.telefono || !requestBody.placa||!requestBody.correo_conductor || !requestBody.nombre_conductor || !requestBody.tipo_carga || !requestBody.tipo_transporte || !requestBody.dimensiones){
		return util.buildResponse(401, {response:"Faltan datos"});
	}
	const placa = requestBody.placa;
	const correo_conductor = requestBody.correo_conductor;
	const nombre_conductor = requestBody.nombre_conductor;
	const telefono = requestBody.telefono;
	const tipo_carga = requestBody.tipo_carga;
	const tipo_transporte = requestBody.tipo_transporte;
	const dimensiones = requestBody.dimensiones;
	const token = requestBody.token;

	const verifyToken = auth.verifyToken(correo_conductor,token);

	if(!verifyToken.verified){
		return util.buildResponse(401,{response:verifyToken.message});
	}
	
	console.log("procuora");
	const getVehiculoResponse = await getVehiculo(placa);
	if(getVehiculoResponse.Item !== undefined){return util.buildResponse(401,{message:"placa ya registrada registrado"})};
	console.log("gantz");
	vehiculo_info = {
		placa: placa,
		telefono: telefono,
		correo_conductor: correo_conductor,
		nombre_conductor: nombre_conductor,
		tipo_carga: tipo_carga,
		tipo_transporte: tipo_transporte,
		dimensiones: dimensiones
	}

	const putVehiculoResponse = await putVehiculo(vehiculo_info);
	if(putVehiculoResponse.$metadata.httpStatusCode !== 200){
		return util.buildResponse(503,{message:'Error del servidor. Porfavor intente luego'});
	}
	return util.buildResponse(200,{response:putVehiculoResponse});

}


async function getVehiculo(placa){
	const input = {
		TableName: "flete_vehiculos",
		Key:{"placa":{"S":placa}}
	};
	const command = new GetItemCommand(input);
	const response = await client.send(command);
	return response;
}

async function putVehiculo(vehiculo_info){
	const input = {
		TableName: "flete_vehiculos",
		Item: {
			"placa":{"S":vehiculo_info.placa},
			"correo_conductor":{"S":vehiculo_info.correo_conductor},
			"nombre_conductor":{"S":vehiculo_info.nombre_conductor},
			"telefono":{"S":vehiculo_info.telefono},
			"tipo_carga":{"S":vehiculo_info.tipo_carga},
			"tipo_transporte":{"S":vehiculo_info.tipo_transporte},
			"dimensiones":{
				"M":{
					"largo":{"S":vehiculo_info.dimensiones.largo},
					"ancho":{"S":vehiculo_info.dimensiones.ancho},
					"altura":{"S":vehiculo_info.dimensiones.altura}
				}
			},
			"calficaciones":{"SS":[""]},
			"calificacion_promedio":{"S":""},
			"metodo_de_pago":{
				"M":{
					"yape":{"S":"false"},
					"plin":{"S":"false"},
					"efectivo":{"S":"false"}
				}
			},
			"reservas":{"SS":[""]},
			"viajes":{"SS":[""]}
		}
	}
	const command = new PutItemCommand(input);
	const response = await client.send(command);
	return response;
}


module.exports.register_vehiculo = register_vehiculo;
