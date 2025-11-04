const mockSend = jest.fn();

jest.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: jest.fn(() => ({ send: mockSend })),
	GetItemCommand: jest.fn(function (input) {
		this.input = input;
	})
}));

const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { fetchUser } = require("../service/get_user");

describe("fetchUser", () => {
	beforeEach(() => {
		mockSend.mockReset();
	});

	it("requests the user from DynamoDB and returns the item", async () => {
		const expectedItem = { correo: { S: "user@example.com" } };
		mockSend.mockResolvedValue({ Item: expectedItem });

		const result = await fetchUser("user@example.com");

		expect(GetItemCommand).toHaveBeenCalledWith({
			TableName: "flete_users",
			Key: {
				correo: { S: "user@example.com" }
			}
		});
		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(result).toEqual(expectedItem);
	});

	it("propagates errors from the DynamoDB client", async () => {
		mockSend.mockRejectedValue(new Error("boom"));

		await expect(fetchUser("user@example.com")).rejects.toThrow("boom");
	});
});
