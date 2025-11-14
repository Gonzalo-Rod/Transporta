const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	GetItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

const { get_vehiculo } = require("../service/get_vehiculo");
const util = require("../utils/util");

describe("get_vehiculo service", () => {
	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
	});

	it("returns 401 when placa is missing", async () => {
		const response = await get_vehiculo({});

		expect(response).toEqual(util.buildResponse(401, { message: "Todos los campos son necesarios" }));
	});

	it("returns DynamoDB item when placa exists", async () => {
		mockSend.mockResolvedValue({ Item: { placa: { S: "ABC123" } } });

		const response = await get_vehiculo({ placa: "ABC123" });

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(response).toEqual(util.buildResponse(200, { Item: { placa: { S: "ABC123" } } }));
	});
});
