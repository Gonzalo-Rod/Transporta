jest.mock("../service/login_user", () => ({
	login_user: jest.fn()
}));

jest.mock("../service/login_driver", () => ({
	login_driver: jest.fn()
}));

const { handler } = require("../index");
const util = require("../utils/util");
const LoginUser = require("../service/login_user");
const LoginDriver = require("../service/login_driver");

describe("login handler", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 404 for unsupported routes", async () => {
		const response = await handler({ httpMethod: "GET", path: "/unknown" });

		expect(response).toEqual(util.buildResponse(404, "404 NOT FOUND"));
	});

	it("routes /health requests", async () => {
		const response = await handler({
			httpMethod: "GET",
			path: "/health",
			body: { status: "ok" }
		});

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({ status: "ok" });
	});

	it("invokes login_user for POST /login-user", async () => {
		const payload = { correo: "user@example.com", password: "secret" };
		LoginUser.login_user.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/login-user",
			body: JSON.stringify(payload)
		});

		expect(LoginUser.login_user).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("invokes login_driver for POST /login-driver", async () => {
		const payload = { correo: "driver@example.com", password: "secret" };
		LoginDriver.login_driver.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/login-driver",
			body: JSON.stringify(payload)
		});

		expect(LoginDriver.login_driver).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("supports direct invocation for user payloads", async () => {
		const payload = { correo: "user@example.com", password: "secret" };
		LoginUser.login_user.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler(payload);

		expect(LoginUser.login_user).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});
});
