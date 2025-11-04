const util = require("../utils/util");
const auth = require("../utils/auth");
const uuid = require("uuid");
const { DynamoDBClient,PutItemCommand,UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({region:'us-east-1'});



async function reserva(requestBody) {
	if(!requestBody.placa || !requestBody.telefono_driver || !requestBody.correo_user || !requestBody.token || !requestBody.correo_driver || !requestBody.inicio || !requestBody.llegada || !requestBody.metodo_de_pago || !requestBody.fecha || !requestBody.hora || !requestBody.precio || !requestBody.comentarios){
		return util.buildResponse(401,{response:"Faltan datos"});
	}
		
	const correo_user = requestBody.correo_user;
	const verifyToken = auth.verifyToken(correo_user,requestBody.token);
	if(!verifyToken.verified){return util.buildResponse(401,{response:verifyToken.message});}

	const correo_driver = requestBody.correo_driver;
	const inicio = requestBody.inicio;
	const llegada = requestBody.llegada;
	const metodo_de_pago = requestBody.metodo_de_pago;
	const placa = requestBody.placa;
	const fecha = requestBody.fecha;
	const hora = requestBody.hora;
	const precio = requestBody.precio;
	const comentarios = requestBody.comentarios;
	const telefono_driver = requestBody.telefono_driver;

	reserva_info = {
		id: uuid.v4(),
		correo_user: correo_user,
		correo_driver : correo_driver,
		inicio : inicio,
		llegada : llegada,
		metodo_de_pago : metodo_de_pago,
		placa: placa,
		fecha : fecha,
		hora : hora,
		precio : precio,
		comentarios : comentarios,
		telefono_driver: telefono_driver
	}
	console.log("Reserva info",reserva_info);

	console.log("ANTES DE");
	const putReservaResponse = await putReserva(reserva_info);


	return putReservaResponse;
}

async function putReserva(reserva_info){
	const input = {
		TableName: "flete_reservas",
		Item: {
			"id":{"S":reserva_info.id},
			"correo_user":{"S":reserva_info.correo_user},
			"correo_driver":{"S":reserva_info.correo_driver},
			"inicio":{"S":reserva_info.inicio},
			"llegada":{"S":reserva_info.llegada},
			"metodo_de_pago":{"S":reserva_info.metodo_de_pago},
			"placa": {"S":reserva_info.placa},
			"fecha":{"S":reserva_info.fecha},
			"hora":{"S":reserva_info.hora},
			"precio":{"S":reserva_info.precio},
			"comentarios":{"S":reserva_info.comentarios},
			"estado":{"S":"solicitada"},
			"codigo":{"S":"temporal"},
			"telefono_driver":{"S":reserva_info.telefono_driver}
		}
	}
	console.log("TEST");
	const command = new PutItemCommand(input);
	const response = await client.send(command);
	console.log("RESPONSEAAAAAAA:   ",response);
	if(response.$metadata.httpStatusCode !== 200){
		return util.buildResponse(503,{message:"Error del servidor.Porfavor intente luego.reserva"});
	}
	
	const input1 = {
		TableName: "flete_users",
		Key:{"correo":{"S":reserva_info.correo_user}},
		UpdateExpression:"ADD reservas :val",
		ExpressionAttributeValues:{":val":{"SS":[reserva_info.id]}} 
	};
	const command1 = new UpdateItemCommand(input1);
	const response1 = await client.send(command1);
	if(response1.$metadata.httpStatusCode !== 200){
		return util.buildResponse(503,{message:"Error del servidor.Porfavor intente luego.reserva id user"});
	}

	const input2 = {
		TableName: "flete_drivers",
		Key:{"correo":{"S":reserva_info.correo_driver}},
		UpdateExpression:"ADD reservas :val",
		ExpressionAttributeValues:{":val":{"SS":[reserva_info.id]}} 
	};
	const command2 = new UpdateItemCommand(input2);
	const response2 = await client.send(command2);
	if(response2.$metadata.httpStatusCode !== 200){
		return util.buildResponse(503,{message:"Error del servidor.Porfavor intente luego.reserva id user"});
	}
	return util.buildResponse(200,{message:"Reserva solicitada exitosamente"});
}


module.exports.reserva = reserva;
