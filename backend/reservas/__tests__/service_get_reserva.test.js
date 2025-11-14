const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	GetItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

jest.mock("../utils/auth", () => ({
	verifyToken: jest.fn()
}));

const { get_reserva } = require("../service/get_reserva");
const util = require("../utils/util");
const auth = require("../utils/auth");

describe("get_reserva service", () => {
	const baseRequest = {
		correo: "user@example.com",
		tabla: "flete_users",
		token: "signed-token"
	};

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
	});

	it("returns 401 when required fields are missing", async () => {
		const response = await get_reserva({ correo: "user@example.com" });

		expect(response).toEqual(util.buildResponse(401, { message: "Faltan datos" }));
	});

	it("returns 401 when token verification fails", async () => {
		auth.verifyToken.mockReturnValue({ verified: false });

		const response = await get_reserva(baseRequest);

		expect(response).toEqual(util.buildResponse(401, { response: "token no coincide" }));
	});

	it("returns reservas list when DynamoDB has data", async () => {
		auth.verifyToken.mockReturnValue({ verified: true });
		mockSend.mockResolvedValue({
			Item: {
				reservas: { SS: ["reserva-1", "reserva-2"] }
			}
		});

		const response = await get_reserva(baseRequest);

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({ reservas: ["reserva-1", "reserva-2"] });
	});

	it("returns empty array when no reservas stored", async () => {
		auth.verifyToken.mockReturnValue({ verified: true });
		mockSend.mockResolvedValue({});

		const response = await get_reserva(baseRequest);

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({ reservas: [] });
	});
});
