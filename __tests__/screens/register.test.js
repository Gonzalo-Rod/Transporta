import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import Register from "../../screens/register";

jest.mock("axios", () => ({
  post: jest.fn(),
}));

const mockedAxios = require("axios");

const createNavigation = () => ({
  navigate: jest.fn(),
});

describe("Register screen", () => {
  let alertSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  const fillForm = (getByPlaceholderText, overrides = {}) => {
    const values = {
      Nombre: "John",
      Apellido: "Doe",
      "Correo electrónico": "john@example.com",
      Contraseña: "StrongPass1",
      Teléfono: "123456789",
      ...overrides,
    };

    fireEvent.changeText(getByPlaceholderText("Nombre"), values.Nombre);
    fireEvent.changeText(getByPlaceholderText("Apellido"), values.Apellido);
    fireEvent.changeText(getByPlaceholderText("Correo electrónico"), values["Correo electrónico"]);
    fireEvent.changeText(getByPlaceholderText("Contraseña"), values.Contraseña);
    fireEvent.changeText(getByPlaceholderText("Teléfono"), values.Teléfono);
  };

  it("renders the registration form", () => {
    const navigation = createNavigation();
    const { getByText, getByPlaceholderText } = render(<Register navigation={navigation} />);

    expect(getByText("Transporta")).toBeTruthy();
    expect(getByText("Moviliza carga rápido y seguro")).toBeTruthy();
    expect(getByPlaceholderText("Nombre")).toBeTruthy();
    expect(getByPlaceholderText("Apellido")).toBeTruthy();
    expect(getByPlaceholderText("Correo electrónico")).toBeTruthy();
    expect(getByPlaceholderText("Contraseña")).toBeTruthy();
    expect(getByPlaceholderText("Teléfono")).toBeTruthy();
    expect(getByText("Registrar")).toBeTruthy();
  });

  it("alerts when form is submitted with missing fields", () => {
    const navigation = createNavigation();
    const { getByText } = render(<Register navigation={navigation} />);

    fireEvent.press(getByText("Registrar"));

    expect(alertSpy).toHaveBeenCalledWith("Error", "Por favor, rellena todos los campos.");
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it("alerts when email is invalid", () => {
    const navigation = createNavigation();
    const { getByText, getByPlaceholderText } = render(<Register navigation={navigation} />);

    fillForm(getByPlaceholderText, { "Correo electrónico": "invalid-email" });

    fireEvent.press(getByText("Registrar"));

    expect(alertSpy).toHaveBeenCalledWith("Error", "Por favor, ingresa un correo válido.");
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it("alerts when phone number is invalid", () => {
    const navigation = createNavigation();
    const { getByText, getByPlaceholderText } = render(<Register navigation={navigation} />);

    fillForm(getByPlaceholderText, { Teléfono: "12345" });

    fireEvent.press(getByText("Registrar"));

    expect(alertSpy).toHaveBeenCalledWith("Error", "El número de teléfono debe tener 9 dígitos.");
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it("submits registration and navigates to Login on success", async () => {
    const navigation = createNavigation();
    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    const { getByText, getByPlaceholderText } = render(<Register navigation={navigation} />);

    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Registrar"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith("Registro exitoso", "Te has registrado con éxito.");
      expect(navigation.navigate).toHaveBeenCalledWith("Login");
    });
  });

  it("shows an error message when registration fails", async () => {
    const navigation = createNavigation();
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    const { getByText, getByPlaceholderText, findByText } = render(<Register navigation={navigation} />);

    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Registrar"));

    expect(await findByText("Error al registrarse. Intenta de nuevo.")).toBeTruthy();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error en el registro:", expect.any(Error));
    expect(alertSpy).not.toHaveBeenCalledWith("Registro exitoso", expect.any(String));
  });
});
