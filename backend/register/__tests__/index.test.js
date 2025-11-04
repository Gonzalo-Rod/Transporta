jest.mock("../service/register_user", () => ({
	register_user: jest.fn()
}));

jest.mock("../service/register_driver", () => ({
	register_driver: jest.fn()
}));

const { handler } = require("../index");
const util = require("../utils/util");
const RegisterUser = require("../service/register_user");
const RegisterDriver = require("../service/register_driver");

describe("register handler", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 404 on unsupported routes", async () => {
		const response = await handler({ httpMethod: "GET", path: "/unknown" });

		expect(response).toEqual(util.buildResponse(404, "404 NOT FOUND"));
	});

	it("responds to /health", async () => {
		const response = await handler({
			httpMethod: "GET",
			path: "/health",
			body: { ok: true }
		});

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({ ok: true });
	});

	it("routes /register-user payloads", async () => {
		const payload = {
			nombre: "User",
			apellido: "Test",
			correo: "user@example.com",
			password: "secret",
			telefono: "555"
		};
		RegisterUser.register_user.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/register-user",
			body: JSON.stringify(payload)
		});

		expect(RegisterUser.register_user).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("routes /register-driver payloads", async () => {
		const payload = {
			nombre: "Driver",
			apellido: "Test",
			correo: "driver@example.com",
			password: "secret",
			telefono: "555",
			placa: "ABC123",
			licencia: "LIC123"
		};

		RegisterDriver.register_driver.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/register-driver",
			body: JSON.stringify(payload)
		});

		expect(RegisterDriver.register_driver).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("supports direct invocation for user payloads", async () => {
		const payload = {
			nombre: "User",
			apellido: "Test",
			correo: "user@example.com",
			password: "secret",
			telefono: "555"
		};

		RegisterUser.register_user.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler(payload);

		expect(RegisterUser.register_user).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("supports direct invocation for driver payloads", async () => {
		const payload = {
			nombre: "Driver",
			correo: "driver@example.com",
			password: "secret",
			telefono: "555",
			placa: "ABC123",
			licencia: "LIC123"
		};

		RegisterDriver.register_driver.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler(payload);

		expect(RegisterDriver.register_driver).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});
});
