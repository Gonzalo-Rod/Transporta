const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	ScanCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

jest.mock("../utils/auth", () => ({
	verifyToken: jest.fn()
}));

const { get_mis_reservas } = require("../service/get_mis_reservas");
const util = require("../utils/util");
const auth = require("../utils/auth");

describe("get_mis_reservas service", () => {
	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
	});

	it("returns 401 when data is missing", async () => {
		const response = await get_mis_reservas({});

		expect(response).toEqual(util.buildResponse(401, { response: "Faltan datos" }));
	});

	it("returns token error when verification fails", async () => {
		auth.verifyToken.mockReturnValue({ verified: false, message: "invalid token" });

		const response = await get_mis_reservas({ rol: "user", correo: "user@example.com", token: "t" });

		expect(response).toEqual(util.buildResponse(401, { response: "invalid token" }));
	});

	it("scans DynamoDB with filters when parametro and valor provided", async () => {
		auth.verifyToken.mockReturnValue({ verified: true });
		mockSend.mockResolvedValue({ Items: [{ id: { S: "1" } }] });

		const response = await get_mis_reservas({
			rol: "user",
			correo: "user@example.com",
			token: "t",
			parametro: "estado",
			valor: "activa"
		});

		expect(mockSend).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
		const parsed = JSON.parse(response.body);
		expect(parsed.response).toEqual([{ id: { S: "1" } }]);
	});
});
