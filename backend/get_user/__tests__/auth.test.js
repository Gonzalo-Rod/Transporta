jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
	verify: jest.fn()
}));

const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../utils/auth");

describe("auth utilities", () => {
	const usuario = { correo: "user@example.com", id: "123" };

	beforeEach(() => {
		process.env.JWT_SECRET = "test-secret";
		jest.resetAllMocks();
	});

	it("returns null when generateToken receives no user info", () => {
		expect(generateToken()).toBeNull();
	});

	it("signs a token with the provided payload", () => {
		jwt.sign.mockReturnValue("signed-token");

		const token = generateToken(usuario);

		expect(jwt.sign).toHaveBeenCalledWith(usuario, "test-secret", { expiresIn: "3h" });
		expect(token).toBe("signed-token");
	});

	it("verifies token successfully when correo matches", () => {
		jwt.verify.mockReturnValue({ correo: usuario.correo, role: "admin" });

		const result = verifyToken(usuario.correo, "token-value");

		expect(jwt.verify).toHaveBeenCalledWith("token-value", "test-secret");
		expect(result).toEqual({
			verified: true,
			message: "verified",
			response: { correo: usuario.correo, role: "admin" }
		});
	});

	it("returns invalid user when correo does not match", () => {
		jwt.verify.mockReturnValue({ correo: "other@example.com" });

		const result = verifyToken(usuario.correo, "token-value");

		expect(result).toEqual({ verified: false, message: "invalid user" });
	});

	it("returns invalid token when verification throws", () => {
		jwt.verify.mockImplementation(() => {
			throw new Error("invalid");
		});

		const result = verifyToken(usuario.correo, "token-value");

		expect(result).toEqual({ verified: false, message: "invalid token" });
	});
});
