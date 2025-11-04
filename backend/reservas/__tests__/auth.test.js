jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
	verify: jest.fn()
}));

const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../utils/auth");

describe("auth helpers", () => {
	const payload = { correo: "user@example.com" };

	beforeEach(() => {
		process.env.JWT_SECRET = "secret";
		jest.resetAllMocks();
	});

	it("returns null if no payload is provided", () => {
		expect(generateToken()).toBeNull();
		expect(jwt.sign).not.toHaveBeenCalled();
	});

	it("signs the provided payload", () => {
		jwt.sign.mockReturnValue("token");

		const result = generateToken(payload);

		expect(jwt.sign).toHaveBeenCalledWith(payload, "secret", { expiresIn: "3h" });
		expect(result).toBe("token");
	});

	it("returns verified when token correo matches", () => {
		jwt.verify.mockReturnValue({ correo: payload.correo });

		const result = verifyToken(payload.correo, "token");

		expect(result.verified).toBe(true);
	});

	it("marks mismatched correo as invalid user", () => {
		jwt.verify.mockReturnValue({ correo: "other@example.com" });

		const result = verifyToken(payload.correo, "token");

		expect(result).toEqual({ verified: false, message: "invalid user" });
	});

	it("marks invalid tokens when verify throws", () => {
		jwt.verify.mockImplementation(() => {
			throw new Error("broken");
		});

		const result = verifyToken(payload.correo, "token");

		expect(result).toEqual({ verified: false, message: "invalid token" });
	});
});
