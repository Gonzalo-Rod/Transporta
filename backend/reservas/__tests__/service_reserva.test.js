const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	PutItemCommand: jest.fn(function (input) {
		this.input = input;
	}),
	UpdateItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

jest.mock("uuid", () => ({
	v4: jest.fn(() => "uuid-123")
}));

jest.mock("../utils/auth", () => ({
	verifyToken: jest.fn()
}));

const { reserva } = require("../service/reserva");
const util = require("../utils/util");
const auth = require("../utils/auth");

describe("reserva service", () => {
	const baseRequest = {
		placa: "ABC123",
		telefono_driver: "999888777",
		correo_user: "user@example.com",
		token: "signed-token",
		correo_driver: "driver@example.com",
		inicio: "A",
		llegada: "B",
		metodo_de_pago: "cash",
		fecha: "2024-08-01",
		hora: "10:00",
		precio: "100",
		comentarios: "be on time"
	};

	beforeEach(() => {
		mockSend.mockReset();
		jest.clearAllMocks();
		auth.verifyToken.mockReturnValue({ verified: true });
	});

	it("returns 401 when required fields are missing", async () => {
		const response = await reserva({});

		expect(response).toEqual(util.buildResponse(401, { response: "Faltan datos" }));
	});

	it("returns 401 when token verification fails", async () => {
		auth.verifyToken.mockReturnValue({ verified: false, message: "invalid token" });

		const response = await reserva(baseRequest);

		expect(response).toEqual(util.buildResponse(401, { response: "invalid token" }));
	});

	it("propagates error when PutItem request fails", async () => {
		mockSend.mockResolvedValueOnce({ $metadata: { httpStatusCode: 500 } });

		const response = await reserva(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(response).toEqual(
			util.buildResponse(503, { message: "Error del servidor.Porfavor intente luego.reserva" })
		);
	});

	it("propagates error when updating user reservas fails", async () => {
		mockSend
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } })
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 500 } });

		const response = await reserva(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(2);
		expect(response).toEqual(
			util.buildResponse(503, {
				message: "Error del servidor.Porfavor intente luego.reserva id user"
			})
		);
	});

	it("propagates error when updating driver reservas fails", async () => {
		mockSend
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } })
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } })
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 500 } });

		const response = await reserva(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(3);
		expect(response).toEqual(
			util.buildResponse(503, {
				message: "Error del servidor.Porfavor intente luego.reserva id user"
			})
		);
	});

	it("returns success response when every write succeeds", async () => {
		mockSend
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } })
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } })
			.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } });

		const response = await reserva(baseRequest);

		expect(mockSend).toHaveBeenCalledTimes(3);
		expect(response).toEqual(util.buildResponse(200, { message: "Reserva solicitada exitosamente" }));
	});
});
