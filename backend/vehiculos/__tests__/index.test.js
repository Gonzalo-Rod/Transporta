jest.mock("../service/register_vehiculo", () => ({
	register_vehiculo: jest.fn()
}));

jest.mock("../service/get_vehiculos", () => ({
	get_vehiculos: jest.fn()
}));

jest.mock("../service/get_vehiculo", () => ({
	get_vehiculo: jest.fn()
}));

const { handler } = require("../index");
const util = require("../utils/util");
const RegisterVehiculo = require("../service/register_vehiculo");
const GetVehiculos = require("../service/get_vehiculos");
const GetVehiculo = require("../service/get_vehiculo");

describe("vehiculos handler", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 404 for unhandled paths", async () => {
		const response = await handler({ httpMethod: "GET", path: "/unknown" });

		expect(response).toEqual(util.buildResponse(404, "404 NOT FOUND"));
	});

	it("returns 200 for health check", async () => {
		const response = await handler({
			httpMethod: "GET",
			path: "/health",
			body: { ok: true }
		});

		expect(response.statusCode).toBe(200);
	});

	it("routes POST /register-vehiculo", async () => {
		const payload = {
			placa: "ABC123",
			correo_conductor: "driver@example.com",
			nombre_conductor: "Driver",
			telefono: "555",
			tipo_carga: "general",
			tipo_transporte: "camion",
			dimensiones: { largo: "1", ancho: "1", altura: "1" }
		};
		RegisterVehiculo.register_vehiculo.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/register-vehiculo",
			body: JSON.stringify(payload)
		});

		expect(RegisterVehiculo.register_vehiculo).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("routes GET /get-vehiculos", async () => {
		GetVehiculos.get_vehiculos.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "GET",
			path: "/get-vehiculos",
			queryStringParameters: { parametro: "tipo_transporte", valor: "camion" }
		});

		expect(GetVehiculos.get_vehiculos).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it("routes POST /get-vehiculos", async () => {
		const payload = { parametro: "tipo_transporte", valor: "camion" };
		GetVehiculos.get_vehiculos.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "POST",
			path: "/get-vehiculos",
			body: JSON.stringify(payload)
		});

		expect(GetVehiculos.get_vehiculos).toHaveBeenCalledWith(payload);
		expect(response.statusCode).toBe(200);
	});

	it("routes GET /get-vehiculo", async () => {
		GetVehiculo.get_vehiculo.mockResolvedValue(util.buildResponse(200, { ok: true }));

		const response = await handler({
			httpMethod: "GET",
			path: "/get-vehiculo",
			queryStringParameters: { placa: "ABC123" }
		});

		expect(GetVehiculo.get_vehiculo).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});
