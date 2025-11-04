const { buildResponse } = require("../utils/util");

describe("buildResponse", () => {
	it("returns a JSON API response", () => {
		const response = buildResponse(204, { ok: true });

		expect(response).toEqual({
			statusCode: 204,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ ok: true })
		});
	});
});
