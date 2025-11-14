const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	GetItemCommand: jest.fn(function (input) {
		this.input = input;
	}),
	PutItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

jest.mock("../utils/auth", () => ({
	verifyToken: jest.fn()
}));

const { register_vehiculo } = require("../service/register_vehiculo");
const util = require("../utils/util");
const auth = require("../utils/auth");

describe("register_vehiculo service", () => {
	const baseRequest = {
		telefono: "999888777",
		placa: "ABC123",
		correo_conductor: "driver@example.com",
		nombre_conductor: "Driver Name",
		tipo_carga: "general",
		tipo_transporte: "camion",
		dimensiones: { largo: "1", ancho: "2", altura: "3" },
		token: "signed-token"
	};

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
		auth.verifyToken.mockReturnValue({ verified: true });
	});

	it("returns 401 when data is missing", async () => {
		const response = await register_vehiculo({});

		expect(response).toEqual(util.buildResponse(401, { response: "Faltan datos" }));
	});

	it("returns 401 when token verification fails", async () => {
		auth.verifyToken.mockReturnValue({ verified: false, message: "invalid token" });

		const response = await register_vehiculo(baseRequest);

		expect(response).toEqual(util.buildResponse(401, { response: "invalid token" }));
	});

	it("returns 401 when placa already exists", async () => {
		mockSend.mockResolvedValueOnce({ Item: { placa: { S: "ABC123" } } });

		const response = await register_vehiculo(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(response).toEqual(
			util.buildResponse(401, { message: "placa ya registrada registrado" })
		);
	});

	it("returns 503 when putVehiculo fails", async () => {
		mockSend.mockResolvedValueOnce({}); // getVehiculo response
		mockSend.mockResolvedValueOnce({ $metadata: { httpStatusCode: 500 } });

		const response = await register_vehiculo(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(2);
		expect(response).toEqual(
			util.buildResponse(503, { message: "Error del servidor. Porfavor intente luego" })
		);
	});

	it("returns success response when insert succeeds", async () => {
		const putResponse = { $metadata: { httpStatusCode: 200 }, id: "new-id" };
		mockSend.mockResolvedValueOnce({}); // getVehiculo
		mockSend.mockResolvedValueOnce(putResponse);

		const response = await register_vehiculo(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(2);
		expect(response).toEqual(util.buildResponse(200, { response: putResponse }));
	});
});
