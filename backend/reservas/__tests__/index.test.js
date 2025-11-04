jest.mock("../service/reserva", () => ({
	reserva: jest.fn()
}));

jest.mock("../service/get_reserva", () => ({
	get_reserva: jest.fn()
}));

jest.mock("../service/get_mis_reservas", () => ({
	get_mis_reservas: jest.fn()
}));

jest.mock("../service/mod_estado_reserva", () => ({
	mod_estado_reserva: jest.fn()
}));

const { handler } = require("../index");
const util = require("../utils/util");
const ReservaService = require("../service/reserva");
const GetReservaService = require("../service/get_reserva");
const GetMisReservasService = require("../service/get_mis_reservas");
const ModReservaEstadoService = require("../service/mod_estado_reserva");

describe("reservas handler", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 404 for unknown route", async () => {
		const response = await handler({ httpMethod: "GET", path: "/unknown" });

		expect(response).toEqual(util.buildResponse(404, "404 NOT FOUD"));
	});

	it("returns 200 for health check", async () => {
		const response = await handler({
			httpMethod: "GET",
			path: "/health",
			body: { ok: true }
		});

		expect(response.statusCode).toBe(200);
	});

	it("routes POST /reserva to ReservaService", async () => {
		const payload = { token: "t", correo_user: "user", placa: "AAA", telefono_driver: "1", correo_driver: "driver", inicio: "A", llegada: "B", metodo_de_pago: "cash", fecha: "2024-01-01", hora: "10", precio: "10", comentarios: "test" };
		ReservaService.reserva.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/reserva",
			body: JSON.stringify(payload)
		});

		expect(ReservaService.reserva).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("routes GET /get-reserva", async () => {
		const payload = { correo: "user", tabla: "flete_users", token: "token" };
		GetReservaService.get_reserva.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "GET",
			path: "/get-reserva",
			body: JSON.stringify(payload)
		});

		expect(GetReservaService.get_reserva).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it("routes GET /get-mis-reservas", async () => {
		GetMisReservasService.get_mis_reservas.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "GET",
			path: "/get-mis-reservas",
			queryStringParameters: { correo: "user", rol: "user", token: "token" }
		});

		expect(GetMisReservasService.get_mis_reservas).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it("routes POST /mod-reserva", async () => {
		const payload = { reserva_id: "1", correo: "user", nuevo_estado: "ok", token: "token" };
		ModReservaEstadoService.mod_estado_reserva.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/mod-reserva",
			body: JSON.stringify(payload)
		});

		expect(ModReservaEstadoService.mod_estado_reserva).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});
});
