const { buildResponse } = require("../utils/util");

describe("buildResponse", () => {
	it("creates a standardized API response", () => {
		const response = buildResponse(202, { ok: true });

		expect(response).toEqual({
			statusCode: 202,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ ok: true })
		});
	});
});
