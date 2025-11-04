jest.mock("../service/get_user", () => ({
	fetchUser: jest.fn()
}));

jest.mock("../utils/auth", () => ({
	verifyToken: jest.fn()
}));

const { handler } = require("../index");
const { buildResponse } = require("../utils/util");
const ProfileService = require("../service/get_user");
const auth = require("../utils/auth");

describe("handler", () => {
	const basePayload = { correo: "user@example.com", token: "token" };

	beforeEach(() => {
		jest.clearAllMocks();
		process.env.JWT_SECRET = "secret";
	});

	it("returns 404 for unsupported route", async () => {
		const response = await handler({
			httpMethod: "GET",
			path: "/not-found"
		});

		expect(response).toEqual(buildResponse(404, "404 NOT FOUND"));
	});

	it("handles direct invocation payloads", async () => {
		auth.verifyToken.mockReturnValue({ verified: true });
		ProfileService.fetchUser.mockResolvedValue({ id: "123" });

		const response = await handler(basePayload);

		expect(auth.verifyToken).toHaveBeenCalledWith(basePayload.correo, basePayload.token);
		expect(ProfileService.fetchUser).toHaveBeenCalledWith(basePayload.correo);
		expect(response).toEqual(buildResponse(200, { response: { id: "123" } }));
	});

	it("returns 400 when body is missing required fields", async () => {
		const response = await handler({
			httpMethod: "POST",
			path: "/get-user",
			body: JSON.stringify({ correo: basePayload.correo })
		});

		expect(auth.verifyToken).not.toHaveBeenCalled();
		expect(response).toEqual(
			buildResponse(400, { message: "correo y token son requeridos" })
		);
	});

	it("returns 400 when body is invalid JSON", async () => {
		const response = await handler({
			httpMethod: "POST",
			path: "/get-user",
			body: "{not-json"
		});

		expect(response).toEqual(
			buildResponse(400, { message: "correo y token son requeridos" })
		);
	});

	it("returns 401 when token verification fails", async () => {
		auth.verifyToken.mockReturnValue({ verified: false, message: "invalid token" });

		const response = await handler({
			httpMethod: "POST",
			path: "/get-user",
			body: JSON.stringify(basePayload)
		});

		expect(ProfileService.fetchUser).not.toHaveBeenCalled();
		expect(response).toEqual(buildResponse(401, { message: "invalid token" }));
	});

	it("returns 404 when no user is found", async () => {
		auth.verifyToken.mockReturnValue({ verified: true });
		ProfileService.fetchUser.mockResolvedValue(undefined);

		const response = await handler({
			httpMethod: "POST",
			path: "/get-user",
			body: JSON.stringify(basePayload)
		});

		expect(response).toEqual(
			buildResponse(404, { message: "Usuario no encontrado" })
		);
	});

	it("returns 500 when fetchUser throws", async () => {
		auth.verifyToken.mockReturnValue({ verified: true });
		ProfileService.fetchUser.mockRejectedValue(new Error("dynamo error"));

		const response = await handler({
			httpMethod: "POST",
			path: "/get-user",
			body: JSON.stringify(basePayload)
		});

		const parsedBody = JSON.parse(response.body);
		expect(response.statusCode).toBe(500);
		expect(parsedBody).toEqual({ message: "Error interno" });
	});
});
