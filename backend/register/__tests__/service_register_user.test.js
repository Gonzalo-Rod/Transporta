const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	PutItemCommand: jest.fn(function (input) {
		this.input = input;
	}),
	GetItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

jest.mock("bcryptjs", () => ({
	hashSync: jest.fn(() => "hashed-password")
}));

const { register_user } = require("../service/register_user");
const util = require("../utils/util");
const bcrypt = require("bcryptjs");

describe("register_user service", () => {
	const payload = {
		nombre: "User",
		apellido: "Test",
		correo: "user@example.com",
		password: "secret",
		telefono: "555"
	};

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
	});

	it("returns 401 when required fields are missing", async () => {
		const response = await register_user({ correo: "user@example.com" });

		expect(response).toEqual(
			util.buildResponse(401, { message: "Todos los campos son necesarios" })
		);
	});

	it("returns 401 when correo already exists", async () => {
		mockSend.mockResolvedValueOnce({ Item: { correo: { S: payload.correo } } });

		const response = await register_user(payload);

		expect(response).toEqual(util.buildResponse(401, { message: "Correo existente" }));
	});

	it("saves a new user and returns 200", async () => {
		mockSend
			.mockResolvedValueOnce({}) // getUserCorreo result
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } }); // saveUser result

		const response = await register_user(payload);

		expect(bcrypt.hashSync).toHaveBeenCalledWith("secret", 10);
		expect(response.statusCode).toBe(200);
		const parsed = JSON.parse(response.body);
		expect(parsed.response).toEqual({ $metadata: { httpStatusCode: 200 } });
	});
});
