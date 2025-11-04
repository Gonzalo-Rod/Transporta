const RegisterDriver = require("./service/register_driver");
const RegisterUser = require("./service/register_user");
const util = require("./utils/util");

const healthPath = "/health";
const registerDriverPath = "/register-driver";
const registerUserPath = "/register-user";

// Normalize the path removing the deployed stage (e.g. /dev)
/**
 * @param {object} event API Gateway proxy event
 */
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
    const isUserPayload = ["nombre", "apellido", "correo", "password", "telefono"].every((key) => key in event);
    if (isUserPayload) {
      response = await RegisterUser.register_user(event);
      console.log("Lambda response:", response);
      return response;
    }

    const isDriverPayload = ["nombre", "apellido", "correo", "password", "telefono", "placa", "licencia"].some((key) => key in event);
    if (isDriverPayload) {
      response = await RegisterDriver.register_driver(event);
      console.log("Lambda response:", response);
      return response;
    }
  }

  switch (true) {
    case method === "GET" && path === healthPath:
      response = util.buildResponse(200, event.body);
      break;

    case method === "POST" && path === registerUserPath:
      response = await RegisterUser.register_user(JSON.parse(event.body));
      break;

    case method === "POST" && path === registerDriverPath:
      response = await RegisterDriver.register_driver(JSON.parse(event.body));
      break;

    default:
      response = util.buildResponse(404, "404 NOT FOUND");
      break;
  }

  console.log("Lambda response:", response);
  return response;
};
