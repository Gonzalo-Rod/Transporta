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

const { login_user } = require("../service/login_user");
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");

describe("login_user", () => {
	const baseRequest = { correo: "user@example.com", password: "secret" };

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
		auth.generateToken.mockReturnValue("signed-token");
	});

	it("returns 401 when required fields are missing", async () => {
		const response = await login_user({ correo: "user@example.com" });

		expect(response).toEqual(
			util.buildResponse(401, { message: "Todos los campos son necesarios" })
		);
	});

	it("returns 401 if user does not exist", async () => {
		mockSend.mockResolvedValue({});

		const response = await login_user(baseRequest);

		expect(response).toEqual(util.buildResponse(401, { message: "correo no registrado" }));
	});

	it("returns 403 when password does not match", async () => {
		mockSend.mockResolvedValue({
			Item: { password: { S: "hash" } }
		});
		bcrypt.compareSync.mockReturnValue(false);

		const response = await login_user(baseRequest);

		expect(response).toEqual(util.buildResponse(403, { message: "password incorrecta" }));
	});

	it("returns token response when credentials are valid", async () => {
		mockSend.mockResolvedValue({
			Item: { password: { S: "hash" }, correo: { S: baseRequest.correo } }
		});
		bcrypt.compareSync.mockReturnValue(true);

		const response = await login_user(baseRequest);

		expect(auth.generateToken).toHaveBeenCalledWith({ correo: baseRequest.correo });
		expect(response.statusCode).toBe(200);
		const parsed = JSON.parse(response.body);
		expect(parsed).toEqual({
			user: { correo: baseRequest.correo },
			token: "signed-token"
		});
	});
});
