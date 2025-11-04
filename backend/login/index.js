const LoginDriver = require("./service/login_driver");
const LoginUser = require("./service/login_user");
const util = require("./utils/util");

const healthPath = "/health";
const loginUserPath = "/login-user";
const loginDriverPath = "/login-driver";

function getNormalizedPath(event) {
	const rawPath = event.path ?? event.rawPath ?? "";
	const stage = event.requestContext?.stage ? `/${event.requestContext.stage}` : "";
	if (stage && rawPath.startsWith(stage)) {
		const trimmed = rawPath.slice(stage.length);
		return trimmed.length ? trimmed : "/";
	}
	return rawPath;
}

function getHttpMethod(event) {
	return event.httpMethod || event.requestContext?.http?.method || "";
}

exports.handler = async (event) => {
	console.log("Request Event:", JSON.stringify(event));
	let response;
	const method = getHttpMethod(event).toUpperCase();
	const path = getNormalizedPath(event);

	const isDirectInvocation = !method && !path;
	if (isDirectInvocation && event && typeof event === "object") {
		const userPayloadKeys = ["correo", "password"];
		const hasUserPayload = userPayloadKeys.every((key) => key in event);
		if (hasUserPayload) {
			response = await LoginUser.login_user(event);
			console.log("Lambda response:", response);
			return response;
		}
	}

	switch (true) {
		case method === "GET" && path === healthPath:
			response = util.buildResponse(200, event.body);
			break;
		case method === "POST" && path === loginUserPath:
			response = await LoginUser.login_user(JSON.parse(event.body));
			break;
		case method === "POST" && path === loginDriverPath:
			response = await LoginDriver.login_driver(JSON.parse(event.body));
			break;
		default:
			response = util.buildResponse(404, "404 NOT FOUND");
			break;
	}

	console.log("Lambda response:", response);
	return response;
};
