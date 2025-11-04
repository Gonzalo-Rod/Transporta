const auth = require("../utils/auth");
const util = require("../utils/util");
const bcrypt = require('bcryptjs');
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({region:'us-east-1'});

async function login_user(requestBody){
	const correo = requestBody.correo;
	const password = requestBody.password;

	if(!correo || !password){
		return util.buildResponse(401,{"message":"Todos los campos son necesarios"});
	}
	const DynamoUser = await getUser(correo);
	console.log("user ",DynamoUser);
	if(DynamoUser.Item === undefined){return util.buildResponse(401,{message:"correo no registrado"});}
	if(!bcrypt.compareSync(password,DynamoUser.Item.password.S)){
		return util.buildResponse(403,{message:"password incorrecta"});
	}
	const user_info = {
		correo: DynamoUser.Item.correo.S
	}
	console.log(user_info);
	const token = auth.generateToken(user_info);
	const response = {
		user: user_info,
		token: token
	}
	console.log(response);


	return util.buildResponse(200,response);
}

async function getUser(correo){
	const input = {
		TableName: "flete_users",
		Key:{"correo":{"S":correo}}
	};
	const command = new GetItemCommand(input);
	const response = await client.send(command);
	return response;
}

module.exports.login_user = login_user;
