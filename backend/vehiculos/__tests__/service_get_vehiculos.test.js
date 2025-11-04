const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	ScanCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { get_vehiculos } = require("../service/get_vehiculos");
const util = require("../utils/util");

describe("get_vehiculos service", () => {
	beforeEach(() => {
		mockSend.mockReset();
		ScanCommand.mockClear();
	});

	it("returns all vehicles when no filters provided", async () => {
		mockSend.mockResolvedValue({ Items: [{ id: { S: "1" } }] });

		const response = await get_vehiculos({});

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(ScanCommand).toHaveBeenCalledWith({
			TableName: "flete_vehiculos"
		});
		expect(response).toEqual(util.buildResponse(200, { response: [{ id: { S: "1" } }] }));
	});

	it("applies filters when parametro and valor present", async () => {
		mockSend.mockResolvedValue({ Items: [] });

		const response = await get_vehiculos({ parametro: "tipo_transporte", valor: "camion" });

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(ScanCommand).toHaveBeenCalledWith({
			TableName: "flete_vehiculos",
			ExpressionAttributeNames: { "#P": "tipo_transporte" },
			ExpressionAttributeValues: { ":valor": { S: "camion" } },
			FilterExpression: "#P = :valor"
		});
		expect(response).toEqual(util.buildResponse(200, { response: [] }));
	});

	it("picks first value when parametro arrives as array", async () => {
		mockSend.mockResolvedValue({ Items: [] });

		await get_vehiculos({
			parametro: ["tipo_transporte"],
			valor: ["camion"]
		});

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(ScanCommand).toHaveBeenCalledWith({
			TableName: "flete_vehiculos",
			ExpressionAttributeNames: { "#P": "tipo_transporte" },
			ExpressionAttributeValues: { ":valor": { S: "camion" } },
			FilterExpression: "#P = :valor"
		});
	});
});
