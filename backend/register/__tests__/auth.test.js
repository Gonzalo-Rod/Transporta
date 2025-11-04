jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
	verify: jest.fn()
}));

const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../utils/auth");

describe("auth utils", () => {
	const payload = { id: "user-123" };

	beforeEach(() => {
		process.env.JWT_SECRET = "secret";
		jest.resetAllMocks();
	});

	it("returns null when no payload is provided", () => {
		expect(generateToken()).toBeNull();
		expect(jwt.sign).not.toHaveBeenCalled();
	});

	it("signs the payload with expiration", () => {
		jwt.sign.mockReturnValue("signed");

		const token = generateToken(payload);

		expect(jwt.sign).toHaveBeenCalledWith(payload, "secret", { expiresIn: "3h" });
		expect(token).toBe("signed");
	});

	it("validates matching id", () => {
		jwt.verify.mockReturnValue({ id: payload.id });

		const result = verifyToken(payload.id, "token");

		expect(result.verified).toBe(true);
	});

	it("rejects mismatched id", () => {
		jwt.verify.mockReturnValue({ id: "other" });

		const result = verifyToken(payload.id, "token");

		expect(result).toEqual({ verified: false, message: "invalid user" });
	});

	it("handles verification errors", () => {
		jwt.verify.mockImplementation(() => {
			throw new Error("boom");
		});

		const result = verifyToken(payload.id, "token");

		expect(result).toEqual({ verified: false, message: "invalid token" });
	});
});
