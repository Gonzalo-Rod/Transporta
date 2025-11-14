const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	GetItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

jest.mock("bcryptjs", () => ({
	compareSync: jest.fn()
}));

jest.mock("../utils/auth", () => ({
	generateToken: jest.fn(() => "signed-token")
}));

const { login_driver } = require("../service/login_driver");
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");

describe("login_driver", () => {
	const baseRequest = {
		correo: "driver@example.com",
		password: "secret"
	};

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
		auth.generateToken.mockReturnValue("signed-token");
	});

	it("returns 401 when required fields are missing", async () => {
		const response = await login_driver({ correo: baseRequest.correo });

		expect(response).toEqual(
			util.buildResponse(401, { message: "Todos los campos son necesarios" })
		);
	});

	it("returns 401 if driver does not exist", async () => {
		mockSend.mockResolvedValue({});

		const response = await login_driver(baseRequest);

		expect(response).toEqual(util.buildResponse(401, { message: "correo no registrado" }));
	});

	it("returns 403 when password does not match", async () => {
		mockSend.mockResolvedValue({
			Item: { password: { S: "hash" } }
		});
		bcrypt.compareSync.mockReturnValue(false);

		const response = await login_driver(baseRequest);

		expect(response).toEqual(util.buildResponse(403, { message: "password incorrecta" }));
	});

	it("returns driver token response when credentials are valid", async () => {
		const driverRecord = {
			Item: {
				password: { S: "hash" },
				correo: { S: baseRequest.correo },
				nombre: { S: "Driver Name" }
			}
		};
		mockSend.mockResolvedValue(driverRecord);
		bcrypt.compareSync.mockReturnValue(true);

		const response = await login_driver(baseRequest);

		expect(auth.generateToken).toHaveBeenCalledWith({
			correo: baseRequest.correo,
			nombre_conductor: driverRecord.Item.nombre.S
		});
		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({
			driver: {
				correo: baseRequest.correo,
				nombre_conductor: driverRecord.Item.nombre.S
			},
			token: "signed-token"
		});
	});
});
