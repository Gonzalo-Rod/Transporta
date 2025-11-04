const auth = require("../utils/auth");
const util = require("../utils/util");
const bcrypt = require('bcryptjs');
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({region:'us-east-1'});

async function register_user(requestBody){
	if(!requestBody.nombre || !requestBody.apellido || !requestBody.correo || !requestBody.password || !requestBody.telefono){return util.buildResponse(401,{message:'Todos los campos son necesarios'});}

	const nombre = requestBody.nombre;
	const apellido = requestBody.apellido;
	const correo = requestBody.correo;
	const password = requestBody.password;
	const telefono = requestBody.telefono;

	const DynamoUser = await getUserCorreo(correo);
	console.log("correo info",DynamoUser);
	if(DynamoUser.Item !== undefined){
		console.log("401 correo existente");
		return util.buildResponse(401,{message:"Correo existente"});
	}
	
	const encryptedPW = bcrypt.hashSync(password,10);
	const userInfo = {
		correo: correo,
		password: encryptedPW,
		nombre: nombre,
		apellido: apellido,
		telefono: telefono
	}
	const saveUserResponse = await saveUser(userInfo);
	if(!saveUserResponse){return util.buildResponse(401,{message:"Error en la consulta"});}
	console.log("saved",saveUserResponse);
	return util.buildResponse(200,{response:saveUserResponse});
}


async function getUserCorreo(correo){
	const input = {
		TableName:"flete_users",
		Key:{
			"correo":{"S":correo}
		}
	};
	const command = new GetItemCommand(input);
	const response = await client.send(command);
	return response;
}

async function saveUser(userInfo){
	const input = {
		TableName:"flete_users",
		Item:{
			"correo":{"S":userInfo.correo},
			"password":{"S":userInfo.password},
			"nombre":{"S":userInfo.nombre},
			"apellido":{"S":userInfo.apellido},
			"telefono":{"S":userInfo.telefono},
			"metodo_de_pago":{
				"M":{
					"yape":{"S":"false"},
					"plin":{"S":"false"},
					"efectivo":{"S":"true"}
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
module.exports.register_user = register_user;
