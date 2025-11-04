const util = require("../utils/util");
const auth = require("../utils/auth");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: 'us-east-1' });

async function get_mis_reservas(requestBody) {
    const rol = requestBody?.rol;
    const correo = requestBody?.correo;
    const rawParametro = requestBody?.parametro ?? "";
    const rawValor = requestBody?.valor ?? "";
    const token = requestBody?.token;

    if (!rol || !correo || !token) {
        return util.buildResponse(401, { response: "Faltan datos" });
    }

    const parametro = typeof rawParametro === "string" ? rawParametro.trim() : "";
    const valor = typeof rawValor === "string" ? rawValor.trim() : "";
    const shouldFilter = Boolean(parametro && valor && valor !== "-" && valor !== "*");

    const verifyToken = auth.verifyToken(correo, token);
    if(!verifyToken.verified){return util.buildResponse(401,{response:verifyToken.message});}
    const reserva_info = {
        rol,
        correo,
        parametro,
        valor,
        shouldFilter
    };
    console.log("RESERVA INFO",reserva_info);
    const vehiculos = await GetReservas(reserva_info);
    return util.buildResponse(200, { response: vehiculos });
}

async function GetReservas(reserva_info) {
    const correo_param = reserva_info.rol === 'user' ? "correo_user" : "correo_driver";
    const expressionAttributeNames = {
        "#C": correo_param
    };
    const expressionAttributeValues = {
        ":correo": { "S": reserva_info.correo }
    };
    const filterParts = ["#C = :correo"];

    if (reserva_info.shouldFilter) {
        expressionAttributeNames["#P"] = reserva_info.parametro;
        expressionAttributeValues[":valor"] = { "S": reserva_info.valor };
        filterParts.push("#P = :valor");
    }
    const input = {
        TableName:'flete_reservas',
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        FilterExpression: filterParts.join(" AND ")
    };

    const command = new ScanCommand(input);
    const response = await client.send(command);
    return response.Items; // Retorna los ítems obtenidos
}

module.exports.get_mis_reservas = get_mis_reservas;
