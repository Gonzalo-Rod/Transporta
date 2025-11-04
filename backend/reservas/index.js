const util = require("./utils/util");
const ReservaService = require("./service/reserva");
const GetReservaService = require("./service/get_reserva");
const GetMisReservasService = require("./service/get_mis_reservas");
const ModReservaEstadoService = require("./service/mod_estado_reserva");
const healthPath = "/health";
const reservaPath = "/reserva";
const get_reservaPath = "/get-reserva";
const get_mis_reservasPath = "/get-mis-reservas";
const mod_estado_reservaPath = "/mod-reserva";

exports.handler = async(event) => {
	console.log("Request Service: ",event);
	let response;
		switch (true) {
		case event.httpMethod === "GET" && event.path === healthPath:
			response = util.buildResponse(200,event.body);
			console.log(response);break;
		case event.httpMethod === "POST" && event.path === reservaPath:
			const reservaBody = JSON.parse(event.body ?? "{}");
			response = await ReservaService.reserva(reservaBody);break;
		case event.httpMethod === "GET" && event.path === get_reservaPath:
			const get_reservaBody = JSON.parse(event.body ?? "{}");
			response = await GetReservaService.get_reserva(get_reservaBody);break;
	case event.httpMethod === "GET" && event.path === get_mis_reservasPath:
		const hasQuery = event.queryStringParameters && Object.keys(event.queryStringParameters).length;
		const hasMultiQuery = event.multiValueQueryStringParameters && Object.keys(event.multiValueQueryStringParameters).length;
		const get_mis_reservasBody = hasQuery
			? event.queryStringParameters
			: hasMultiQuery
				? Object.fromEntries(Object.entries(event.multiValueQueryStringParameters).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]))
				: event.body
					? JSON.parse(event.body)
					: {};
		response = await GetMisReservasService.get_mis_reservas(get_mis_reservasBody);break;
		case event.httpMethod === "POST" && event.path === mod_estado_reservaPath:
			const mod_estado_reservaBody = JSON.parse(event.body ?? "{}");
			response = await ModReservaEstadoService.mod_estado_reserva(mod_estado_reservaBody);break;
		default:
			response = util.buildResponse(404,"404 NOT FOUD");break;
	}
	return response;
}
