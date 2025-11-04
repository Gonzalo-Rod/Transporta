const { buildResponse } = require("../utils/util");

describe("buildResponse", () => {
	it("wraps payload as an API Gateway response", () => {
		const result = buildResponse(201, { ok: true });

		expect(result).toEqual({
			statusCode: 201,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ ok: true })
		});
	});
});
