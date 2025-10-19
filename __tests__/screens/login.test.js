import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../screens/login";

jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("../../utils/Auth", () => ({
  setUserSession: jest.fn(),
}));

const mockedAxios = require("axios");
const mockedAuth = require("../../utils/Auth");

const createNavigation = () => ({
  navigate: jest.fn(),
});

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const typeCredentials = (getByPlaceholderText) => {
    fireEvent.changeText(getByPlaceholderText("nombre@email.com"), "user@test.com");
    fireEvent.changeText(getByPlaceholderText("contraseña"), "password123");
  };

  it("renders the basic UI elements", () => {
    const navigation = createNavigation();
    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={navigation} />);

    expect(getByText("Transporta")).toBeTruthy();
    expect(getByText("Moviliza carga rápido y seguro")).toBeTruthy();
    expect(getByPlaceholderText("nombre@email.com")).toBeTruthy();
    expect(getByPlaceholderText("contraseña")).toBeTruthy();
    expect(getByText("Continuar")).toBeTruthy();
  });

  it("logs in successfully and navigates to Main on valid credentials", async () => {
    const navigation = createNavigation();
    mockedAxios.post.mockResolvedValue({
      data: {
        token: "fake-token",
        user: {
          correo: "user@test.com",
        },
      },
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={navigation} />);
    typeCredentials(getByPlaceholderText);

    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(mockedAuth.setUserSession).toHaveBeenCalledWith("user@test.com", "fake-token");
      expect(navigation.navigate).toHaveBeenCalledWith("Main");
    });
  });

  it("shows an error message when the backend responds without a token", async () => {
    const navigation = createNavigation();
    mockedAxios.post.mockResolvedValue({
      data: {
        message: "Correo o contraseña incorrectos",
      },
    });

    const { getByText, getByPlaceholderText, findByText } = render(<LoginScreen navigation={navigation} />);
    typeCredentials(getByPlaceholderText);

    fireEvent.press(getByText("Continuar"));

    expect(await findByText("Correo o contraseña incorrectos")).toBeTruthy();
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(mockedAuth.setUserSession).not.toHaveBeenCalled();
  });

  it("shows a generic error message when the request fails", async () => {
    const navigation = createNavigation();
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          body: JSON.stringify({ message: "Credenciales inválidas" }),
        },
      },
    });

    const { getByText, getByPlaceholderText, findByText } = render(<LoginScreen navigation={navigation} />);
    typeCredentials(getByPlaceholderText);

    fireEvent.press(getByText("Continuar"));

    expect(await findByText("Credenciales inválidas")).toBeTruthy();
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(mockedAuth.setUserSession).not.toHaveBeenCalled();
  });
});
