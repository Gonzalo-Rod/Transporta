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

const { register_driver } = require("../service/register_driver");
const util = require("../utils/util");
const bcrypt = require("bcryptjs");

describe("register_driver service", () => {
	const payload = {
		nombre: "Driver",
		apellido: "Test",
		correo: "driver@example.com",
		password: "secret",
		telefono: "555"
	};

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
	});

	it("returns 401 when required fields are missing", async () => {
		const response = await register_driver({ correo: "driver@example.com" });

		expect(response).toEqual(
			util.buildResponse(401, { message: "Todos los campos son necesarios" })
		);
	});

	it("returns 401 when correo already exists", async () => {
		mockSend.mockResolvedValueOnce({ Item: { correo: { S: payload.correo } } });

		const response = await register_driver(payload);

		expect(response).toEqual(util.buildResponse(401, { message: "Correo existente" }));
	});

	it("returns error when saveDriver fails", async () => {
		mockSend
			.mockResolvedValueOnce({}) // getDriverCorreo
			.mockResolvedValueOnce(null); // saveDriver returns falsy

		const response = await register_driver(payload);

		expect(response).toEqual(util.buildResponse(401, { message: "Error en la consulta" }));
	});

	it("saves a new driver and returns 200", async () => {
		mockSend
			.mockResolvedValueOnce({}) // getDriverCorreo
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } }); // saveDriver

		const response = await register_driver(payload);

		expect(bcrypt.hashSync).toHaveBeenCalledWith("secret", 10);
		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body).response).toEqual({ $metadata: { httpStatusCode: 200 } });
	});
});
