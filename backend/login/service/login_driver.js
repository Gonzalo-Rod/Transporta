const auth = require("../utils/auth");
const util = require("../utils/util");
const bcrypt = require('bcryptjs');
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({region:'us-east-1'});

async function login_driver(requestBody){
	const correo = requestBody.correo;
	const password = requestBody.password;

	if(!correo || !password){
		return util.buildResponse(401,{"message":"Todos los campos son necesarios"});
	}
	const DynamoDriver = await getDriver(correo);
	console.log("driver ",DynamoDriver);
	if(DynamoDriver.Item === undefined){return util.buildResponse(401,{message:"correo no registrado"});}
	if(!bcrypt.compareSync(password,DynamoDriver.Item.password.S)){
		return util.buildResponse(403,{message:"password incorrecta"});
	}
	const driver_info = {
		correo: DynamoDriver.Item.correo.S,
		nombre_conductor: DynamoDriver.Item.nombre.S
	}
	const token = auth.generateToken(driver_info);
	const response = {
		driver: driver_info,
		token: token
	}
	console.log(response);


	return util.buildResponse(200,response);
}

async function getDriver(correo){
	const input = {
		TableName: "flete_drivers",
		Key:{"correo":{"S":correo}}
	};
	const command = new GetItemCommand(input);
	const response = await client.send(command);
	return response;
}
module.exports.login_driver = login_driver;
