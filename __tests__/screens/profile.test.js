import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import UserProfile from "../../screens/profile";

jest.mock("../../assets/ConductorTemp.png", () => 1);

jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("../../utils/Auth", () => ({
  getUser: jest.fn(),
  getToken: jest.fn(),
}));

const axios = require("axios");
const { getUser, getToken } = require("../../utils/Auth");

const mockUserData = {
  nombre: { S: "Juan" },
  apellido: { S: "Perez" },
  telefono: { S: "987654321" },
  correo: { S: "juan@example.com" },
  metodo_de_pago: { S: "visa1" },
};

const createNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
});

describe("UserProfile screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUser.mockResolvedValue("user@example.com");
    getToken.mockResolvedValue("token-123");
    axios.post.mockResolvedValue({
      data: {
        response: mockUserData,
      },
    });
  });

  it("fetches and displays user information", async () => {
    const navigation = createNavigation();

    const { getAllByText, getByText } = render(
      <NavigationContainer>
        <UserProfile navigation={navigation} />
      </NavigationContainer>
    );

    expect(getByText("Tu Perfil")).toBeTruthy();
    await waitFor(() => {
      expect(getAllByText("Juan Perez").length).toBeGreaterThan(0);
    });
    expect(getByText("User")).toBeTruthy();
    expect(getByText("987654321")).toBeTruthy();
    expect(getByText("juan@example.com")).toBeTruthy();
  });

  it("navigates through header and buttons", async () => {
    const navigation = createNavigation();

    const { getByTestId } = render(
      <NavigationContainer>
        <UserProfile navigation={navigation} />
      </NavigationContainer>
    );

    await waitFor(() => expect(getUser).toHaveBeenCalled());

    fireEvent.press(getByTestId("profile-back"));
    expect(navigation.goBack).toHaveBeenCalled();

    fireEvent.press(getByTestId("profile-activity"));
    expect(navigation.navigate).toHaveBeenCalledWith("Activity");

    fireEvent.press(getByTestId("profile-payment"));
    expect(navigation.navigate).toHaveBeenCalledWith("PaymentInfo", {
      user_data: "visa1",
    });

    fireEvent.press(getByTestId("profile-logout"));
    expect(navigation.navigate).toHaveBeenCalledWith("Login");
  });
});
