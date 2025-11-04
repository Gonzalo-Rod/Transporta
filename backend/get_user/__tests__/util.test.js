const { buildResponse } = require("../utils/util");

describe("buildResponse", () => {
	it("returns a response envelope with JSON body", () => {
		const result = buildResponse(200, { ok: true });

		expect(result).toEqual({
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ ok: true })
		});
	});
});
