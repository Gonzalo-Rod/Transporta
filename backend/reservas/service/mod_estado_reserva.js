const util = require("../utils/util");
const auth = require("../utils/auth");
const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: 'us-east-1' });

async function mod_estado_reserva(requestBody) {
    
    if(!requestBody.reserva_id || !requestBody.correo || !requestBody.nuevo_estado || !requestBody.token){
        return util.buildResponse(401, {response:"Faltan datos"});
    }

    const correo = requestBody.correo;
    const reserva_id = requestBody.reserva_id;
    const nuevo_estado = requestBody.nuevo_estado;
    const verifyToken = auth.verifyToken(correo,requestBody.token);
	if(!verifyToken.verified){return util.buildResponse(401,{response:verifyToken.message});}

    reserva_info = {
        correo: correo,
        reserva_id: reserva_id,
        nuevo_estado: nuevo_estado
    }
    console.log("RESERVA INFO",reserva_info);
    const mod_response = await mod(reserva_info);
    return util.buildResponse(200, { response: mod_response });
}

async function mod(reserva_info) {

    const input = {
        TableName:'flete_reservas',
        Key:{"id":{"S":reserva_info.reserva_id}},
        UpdateExpression: "SET #estado = :nuevo_estado",
        ExpressionAttributeNames: {
            "#estado": "estado"  
        },
        ExpressionAttributeValues: {
            ":nuevo_estado": { "S": reserva_info.nuevo_estado }  
        },
        ReturnValues: "ALL_NEW"
    };

    const command = new UpdateItemCommand(input);
    const response = await client.send(command);
    return response; // Retorna los ítems obtenidos
}

module.exports.mod_estado_reserva = mod_estado_reserva;
