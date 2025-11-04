jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
	verify: jest.fn()
}));

const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../utils/auth");

describe("auth helpers", () => {
	const payload = { correo: "driver@example.com" };

	beforeEach(() => {
		process.env.JWT_SECRET = "secret";
		jest.resetAllMocks();
	});

	it("returns null when generateToken gets no payload", () => {
		expect(generateToken()).toBeNull();
		expect(jwt.sign).not.toHaveBeenCalled();
	});

	it("signs tokens with configured secret", () => {
		jwt.sign.mockReturnValue("signed");

		const token = generateToken(payload);

		expect(jwt.sign).toHaveBeenCalledWith(payload, "secret", { expiresIn: "3h" });
		expect(token).toBe("signed");
	});

	it("returns verified for matching correo", () => {
		jwt.verify.mockReturnValue({ correo: payload.correo });

		const result = verifyToken(payload.correo, "token");

		expect(result.verified).toBe(true);
	});

	it("rejects mismatched correo", () => {
		jwt.verify.mockReturnValue({ correo: "other@example.com" });

		const result = verifyToken(payload.correo, "token");

		expect(result).toEqual({ verified: false, message: "invalid user" });
	});

	it("handles invalid tokens", () => {
		jwt.verify.mockImplementation(() => {
			throw new Error("boom");
		});

		const result = verifyToken(payload.correo, "token");

		expect(result).toEqual({ verified: false, message: "invalid token" });
	});
});
