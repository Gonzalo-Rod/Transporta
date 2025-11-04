const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

async function fetchUser(correo) {
	const input = {
		TableName: "flete_users",
		Key: {
			correo: { S: correo }
		}
	};

	const command = new GetItemCommand(input);
	const response = await client.send(command);
	return response.Item;
}

module.exports.fetchUser = fetchUser;
