jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
	verify: jest.fn()
}));

const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../utils/auth");

describe("auth utilities", () => {
	const user = { correo: "user@example.com" };

	beforeEach(() => {
		process.env.JWT_SECRET = "secret";
		jest.resetAllMocks();
	});

	it("returns null if generateToken is called without payload", () => {
		expect(generateToken()).toBeNull();
		expect(jwt.sign).not.toHaveBeenCalled();
	});

	it("delegates to jwt.sign with configured expiration", () => {
		jwt.sign.mockReturnValue("signed-token");

		const token = generateToken(user);

		expect(jwt.sign).toHaveBeenCalledWith(user, "secret", { expiresIn: "3h" });
		expect(token).toBe("signed-token");
	});

	it("verifies a valid token for the same correo", () => {
		jwt.verify.mockReturnValue({ correo: user.correo, role: "user" });

		const result = verifyToken(user.correo, "token");

		expect(result).toEqual({
			verified: true,
			message: "verified",
			response: { correo: user.correo, role: "user" }
		});
	});

	it("flags mismatched correo as invalid user", () => {
		jwt.verify.mockReturnValue({ correo: "other@example.com" });

		const result = verifyToken(user.correo, "token");

		expect(result).toEqual({ verified: false, message: "invalid user" });
	});

	it("returns invalid token when jwt.verify throws", () => {
		jwt.verify.mockImplementation(() => {
			throw new Error("boom");
		});

		const result = verifyToken(user.correo, "token");

		expect(result).toEqual({ verified: false, message: "invalid token" });
	});
});
