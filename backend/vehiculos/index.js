const RegisterVehiculo = require("./service/register_vehiculo");
const GetVehiculos = require("./service/get_vehiculos");
const GetVehiculo = require("./service/get_vehiculo");
const util = require("./utils/util");

const healthPath = "/health";
const registerVehiculoPath = "/register-vehiculo";
const getVehiculosPath = "/get-vehiculos";
const getVehiculoPath = "/get-vehiculo";

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
	let restBody;

	const isDirectInvocation = !method && !path;
	if (isDirectInvocation && event && typeof event === "object") {
		if (event.placa && event.correo_conductor) {
			response = await RegisterVehiculo.register_vehiculo(event);
			console.log("Lambda response:", response);
			return response;
		}
	}

	switch (true) {
		case method === "GET" && path === healthPath:
			response = util.buildResponse(200, event.body);
			break;
		case method === "POST" && path === registerVehiculoPath:
			response = await RegisterVehiculo.register_vehiculo(JSON.parse(event.body));
			break;
		case (method === "GET" || method === "POST") && path === getVehiculosPath:
			restBody = method === "GET"
				? (event.queryStringParameters && Object.keys(event.queryStringParameters).length
					? event.queryStringParameters
					: event.multiValueQueryStringParameters && Object.keys(event.multiValueQueryStringParameters).length
						? Object.fromEntries(Object.entries(event.multiValueQueryStringParameters).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]))
						: {})
				: JSON.parse(event.body ?? "{}");
			response = await GetVehiculos.get_vehiculos(restBody);
			break;
		case (method === "GET" || method === "POST") && path === getVehiculoPath:
			restBody = method === "GET"
				? (event.queryStringParameters ?? {})
				: JSON.parse(event.body ?? "{}");
			response = await GetVehiculo.get_vehiculo(restBody);
			break;
		default:
			response = util.buildResponse(404, "404 NOT FOUND");
			break;
	}

	console.log("Lambda response:", response);
	return response;
};
