const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	UpdateItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

jest.mock("../utils/auth", () => ({
	verifyToken: jest.fn()
}));

const { mod_estado_reserva } = require("../service/mod_estado_reserva");
const util = require("../utils/util");
const auth = require("../utils/auth");

describe("mod_estado_reserva service", () => {
	const baseRequest = {
		reserva_id: "res-1",
		correo: "driver@example.com",
		nuevo_estado: "completada",
		token: "signed-token"
	};

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
	});

	it("returns 401 when request data is incomplete", async () => {
		const response = await mod_estado_reserva({});

		expect(response).toEqual(util.buildResponse(401, { response: "Faltan datos" }));
	});

	it("returns 401 when token validation fails", async () => {
		auth.verifyToken.mockReturnValue({ verified: false, message: "invalid token" });

		const response = await mod_estado_reserva(baseRequest);

		expect(response).toEqual(util.buildResponse(401, { response: "invalid token" }));
	});

	it("updates DynamoDB and returns the response when token is valid", async () => {
		auth.verifyToken.mockReturnValue({ verified: true });
		mockSend.mockResolvedValue({ Attributes: { estado: { S: "completada" } } });

		const response = await mod_estado_reserva(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({
			response: { Attributes: { estado: { S: "completada" } } }
		});
	});
});
