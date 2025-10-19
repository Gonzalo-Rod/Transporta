import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Activity from "../../screens/actividad";

jest.mock("../../utils/Auth", () => ({
  getUser: jest.fn(),
  getToken: jest.fn(),
}));

jest.mock("axios", () => jest.fn());

jest.mock("../../assets/Camion.png", () => 1);
jest.mock("../../assets/Flete.png", () => 1);
jest.mock("../../assets/Van.png", () => 1);
jest.mock("../../assets/Furgoneta.png", () => 1);

const { getUser, getToken } = require("../../utils/Auth");
const mockedAxios = require("axios");

const createNavigation = () => ({
  goBack: jest.fn(),
});

describe("Activity screen", () => {
  beforeAll(() => {
    global.setLoading = jest.fn();
  });

  afterAll(() => {
    delete global.setLoading;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getUser.mockResolvedValue("user@example.com");
    getToken.mockResolvedValue("token-123");
    mockedAxios.mockResolvedValue({
      data: {
        body: JSON.stringify({ response: [] }),
      },
    });
  });

  const renderActivity = (navigation) => render(<Activity navigation={navigation} />);

  it("renders the activity screen with trips list", async () => {
    const navigation = createNavigation();
    const { getByText, getAllByText } = renderActivity(navigation);

    expect(getByText("Tu Actividad")).toBeTruthy();
    await waitFor(() => {
      expect(getAllByText("S/. 100")).toHaveLength(3);
    });
  });

  it("navigates back when pressing the back button", async () => {
    const navigation = createNavigation();
    const { getByTestId } = renderActivity(navigation);

    const backButton = await waitFor(() => getByTestId("go-back-button"));
    fireEvent.press(backButton);

    expect(navigation.goBack).toHaveBeenCalled();
  });

  it("fetches user data and trips on mount", async () => {
    const navigation = createNavigation();
    renderActivity(navigation);

    await waitFor(() => {
      expect(getUser).toHaveBeenCalled();
      expect(getToken).toHaveBeenCalled();
      expect(mockedAxios).toHaveBeenCalledWith({
        method: "POST",
        url: "https://s1oxe0wq3c.execute-api.us-east-1.amazonaws.com/dev/get-mis-viajes",
        headers: { "Content-Type": "application/json" },
        data: {
          httpMethod: "GET",
          path: "/get-mis-viajes",
          body: JSON.stringify({
            correo: "user@example.com",
            rol: "user",
            parametro: "-",
            valor: "-",
            token: "token-123",
          }),
        },
      });
    });
  });
});
