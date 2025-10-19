import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AdvReservation from "../../screens/advReservation";

jest.mock("../../utils/Auth", () => ({
  getUser: jest.fn(),
  getToken: jest.fn(),
}));

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("../../components/Inputs/searchLocation", () => {
  const React = require("react");
  const { Text, TouchableOpacity } = require("react-native");

  const MockSearchLocation = ({ placeholder, onLocationSelect }) => (
    <TouchableOpacity
      testID={`search-${placeholder}`}
      onPress={() => onLocationSelect(`${placeholder}-location`)}
    >
      <Text>{placeholder}</Text>
    </TouchableOpacity>
  );

  return MockSearchLocation;
});

const { getUser, getToken } = require("../../utils/Auth");
const axios = require("axios");

const driverData = {
  mail: "driver@example.com",
  phone: "999123456",
  plate: "ABC-123",
};

const createNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
});

const createRoute = () => ({
  params: {
    driverData,
  },
});

describe("AdvReservation screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUser.mockResolvedValue("user@example.com");
    getToken.mockResolvedValue("token-123");
    axios.get.mockResolvedValue({
      data: {
        routes: [
          {
            legs: [
              {
                distance: { value: 10000 },
                duration: { value: 1800 },
              },
            ],
          },
        ],
      },
    });
    axios.post.mockResolvedValue({ data: { success: true } });
  });

  const renderScreen = () => {
    const navigation = createNavigation();
    const route = createRoute();

    const utils = render(<AdvReservation navigation={navigation} route={route} />);

    return {
      ...utils,
      navigation,
    };
  };

  it("renders form inputs and header", async () => {
    const { getByText, getByPlaceholderText } = renderScreen();

    await waitFor(() => {
      expect(getUser).toHaveBeenCalled();
      expect(getToken).toHaveBeenCalled();
    });

    expect(getByText("Datos de reserva")).toBeTruthy();
    expect(getByText("Buscar partida")).toBeTruthy();
    expect(getByText("Buscar destino")).toBeTruthy();
    expect(getByPlaceholderText("Fecha")).toBeTruthy();
    expect(getByPlaceholderText("Hora")).toBeTruthy();
    expect(getByPlaceholderText("Notas")).toBeTruthy();
    expect(getByText("Precio Sugerido")).toBeTruthy();
  });

  it("handles location selection and calculates price/duration", async () => {
    const { getByTestId, getByText } = renderScreen();

    await waitFor(() => expect(getUser).toHaveBeenCalled());

    fireEvent.press(getByTestId("search-Buscar partida"));
    fireEvent.press(getByTestId("search-Buscar destino"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://proyecto-is-google-api.vercel.app/google-maps/directions",
        {
          params: {
            origin: "Buscar partida-location",
            destination: "Buscar destino-location",
          },
        }
      );
      expect(getByText(/S\/\. 50\.0/)).toBeTruthy();
    });
  });

  it("submits reservation and navigates to confirmation", async () => {
    const { getByTestId, getByPlaceholderText, getByText, navigation } = renderScreen();

    await waitFor(() => expect(getUser).toHaveBeenCalled());

    fireEvent.press(getByTestId("search-Buscar partida"));
    fireEvent.press(getByTestId("search-Buscar destino"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(getByText(/S\/\. 50\.0/)).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText("Fecha"), "2024-10-15");
    fireEvent.changeText(getByPlaceholderText("Hora"), "10:30");
    fireEvent.changeText(getByPlaceholderText("Notas"), "Sin comentarios");

    fireEvent.press(getByText("Solicitar Reserva"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/reserva",
        expect.objectContaining({
          correo_user: "user@example.com",
          correo_driver: driverData.mail,
          telefono_driver: driverData.phone,
          inicio: "Buscar partida-location",
          llegada: "Buscar destino-location",
          precio: "50.0",
          duracion: "30.0",
          fecha: "2024-10-15",
          hora: "10:30",
          comentarios: "Sin comentarios",
          token: "token-123",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
      expect(navigation.navigate).toHaveBeenCalledWith("AdvConfirmation", {
        originAddress: "Buscar partida-location",
        destinationAddress: "Buscar destino-location",
        date: "2024-10-15",
        time: "10:30",
      });
    });
  });

  it("calls goBack when tapping the header back button", async () => {
    const { getByTestId, navigation } = renderScreen();

    await waitFor(() => expect(getUser).toHaveBeenCalled());

    fireEvent.press(getByTestId("adv-reservation-back"));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
