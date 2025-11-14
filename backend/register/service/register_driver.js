const auth = require("../utils/auth");
const util = require("../utils/util");
const bcrypt = require('bcryptjs');
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({region:'us-east-1'});

async function register_driver(requestBody){
	const nombre = requestBody.nombre;
	const apellido = requestBody.apellido;
	const correo = requestBody.correo;
	const password = requestBody.password;
	const telefono = requestBody.telefono;

	if(!nombre || !apellido || !correo || !password || !telefono){
		return util.buildResponse(401,{message:'Todos los campos son necesarios'});
	}
	console.log("hola homero");
	const DynamoDriver = await getDriverCorreo(correo);
	console.log("correo info",DynamoDriver);
	console.log(DynamoDriver.Item);
	if(DynamoDriver.Item !== undefined){
		console.log("401 correo existente");
		return util.buildResponse(401,{message:"Correo existente"});
	}
	const encryptedPW = bcrypt.hashSync(password,10);
	const DriverInfo = {
		correo: correo,
		password: encryptedPW,
		nombre: nombre,
		apellido: apellido,
		telefono: telefono
	}
	const saveDriverResponse = await saveDriver(DriverInfo);
	if(!saveDriverResponse){return util.buildResponse(401,{message:"Error en la consulta"});}
	console.log("saved",saveDriverResponse);
	return util.buildResponse(200,{response:saveDriverResponse});
}

async function getDriverCorreo(correo){
	const input = {
		TableName:"flete_drivers",
		Key:{"correo":{"S":correo}}
	};
	const command = new GetItemCommand(input);
	const response = await client.send(command);
	return response;
}

async function saveDriver(driverInfo){
	const input = {
		TableName:"flete_drivers",
		Item:{
			"correo":{"S":driverInfo.correo},
			"password":{"S":driverInfo.password},
			"telefono":{"S":driverInfo.telefono},
			"nombre":{"S":driverInfo.nombre},
			"apellido":{"S":driverInfo.apellido},
			"metodo_de_pago":{
				"M":{
					"yape":{"S":"false"},
					"plin":{"S":"false"},
					"efectivo":{"S":"true"}
				}
			},
			"reservas":{"SS":[""]},
			"viajes":{"SS":[""]},
			"vehiculos":{"SS":[""]}
		}
	};
	const command = new PutItemCommand(input);
	const response = await client.send(command);
	return response;
}
module.exports.register_driver = register_driver;
