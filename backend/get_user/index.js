const util = require("./utils/util");
const ProfileService = require("./service/get_user");
const auth = require("./utils/auth");

const getUserPath = "/get-user";

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

function parseBody(body) {
	if (!body) {
		return {};
	}
	if (typeof body === "string") {
		try {
			return JSON.parse(body);
		} catch (error) {
			console.error("Invalid JSON body", error);
			return {};
	}
	}
	return body;
}

exports.handler = async (event) => {
	console.log("Request Event:", JSON.stringify(event));

	const method = getHttpMethod(event).toUpperCase();
	const path = getNormalizedPath(event);

	const isDirectInvocation = !method && !path;
	if (isDirectInvocation) {
		return handleRequest(event);
	}

	if (method !== "POST" || path !== getUserPath) {
		return util.buildResponse(404, "404 NOT FOUND");
	}

	const body = parseBody(event.body);
	return handleRequest(body);
};

async function handleRequest(payload) {
	const { correo, token } = payload || {};

	if (!correo || !token) {
		return util.buildResponse(400, { message: "correo y token son requeridos" });
	}

	const verification = auth.verifyToken(correo, token);
	if (!verification.verified) {
		return util.buildResponse(401, { message: verification.message });
	}

	try {
		const user = await ProfileService.fetchUser(correo);
		if (!user) {
			return util.buildResponse(404, { message: "Usuario no encontrado" });
		}
		return util.buildResponse(200, { response: user });
	} catch (error) {
		console.error("Error fetching user:", error);
		return util.buildResponse(500, { message: "Error interno" });
	}
}
