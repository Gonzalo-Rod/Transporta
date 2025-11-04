const util = require("../utils/util");
const auth = require("../utils/auth");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: 'us-east-1' });

function pickValue(value) {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

async function get_vehiculos(requestBody) {
    const parametro = pickValue(requestBody?.parametro);
    const valor = pickValue(requestBody?.valor);

    const normalizedParametro = typeof parametro === "string" ? parametro.trim() : (parametro ?? "").toString().trim();
    const normalizedValor = typeof valor === "string" ? valor.trim() : (valor ?? "").toString().trim();

    const shouldFilter = Boolean(normalizedParametro && normalizedValor);

    console.log("get_vehiculos parsed params", normalizedParametro, normalizedValor, { shouldFilter, requestBody });

    const vehiculos = await GetVehiculos(shouldFilter ? normalizedParametro : null, shouldFilter ? normalizedValor : null);
    return util.buildResponse(200, { response: vehiculos });
}

async function GetVehiculos(parametro, valor) {
    const input = {
        TableName: 'flete_vehiculos',
    };

    if (parametro && valor) {
        input.ExpressionAttributeNames = {
            "#P": parametro,
        };
        input.ExpressionAttributeValues = {
            ":valor": { "S": valor },
        };
        input.FilterExpression = "#P = :valor";
    }

    const command = new ScanCommand(input);
    const response = await client.send(command);
    return response.Items ?? [];
}

module.exports.get_vehiculos = get_vehiculos;
