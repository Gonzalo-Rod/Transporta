import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Reservations from "../../screens/reservation";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../utils/Auth", () => ({
  getUser: jest.fn(),
  getToken: jest.fn(),
}));

jest.mock("../../assets/Reserva.png", () => 1);

const axios = require("axios");
const { getUser, getToken } = require("../../utils/Auth");

const buildReservation = ({
  id = "res-1",
  estado = "solicitada",
  inicio = "Origen",
  llegada = "Destino",
  fecha = "2024-10-15",
  hora = "10:30",
  placa = "XYZ123",
} = {}) => ({
  id: { S: id },
  estado: { S: estado },
  inicio: { S: inicio },
  llegada: { S: llegada },
  fecha: { S: fecha },
  hora: { S: hora },
  placa: { S: placa },
});

const wrapWithNavigation = (ui) => (
  <NavigationContainer independent>{ui}</NavigationContainer>
);

const createNavigation = () => ({
  navigate: jest.fn(),
});

describe("Reservations screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUser.mockResolvedValue("user@example.com");
    getToken.mockResolvedValue("token-123");
  });

  const mockReservationsResponse = (reservations) => ({
    data: {
      body: JSON.stringify({ response: reservations }),
    },
  });

  it("fetches and renders reservations with statuses", async () => {
    const navigation = createNavigation();

    axios.get
      .mockResolvedValueOnce(
        mockReservationsResponse([
          buildReservation({ id: "res-1", estado: "solicitada", inicio: "Partida 1" }),
        ])
      )
      .mockResolvedValueOnce(
        mockReservationsResponse([
          buildReservation({ id: "res-2", estado: "aceptada", inicio: "Partida 2" }),
        ])
      );

    const { getByText, getByTestId } = render(
      wrapWithNavigation(<Reservations navigation={navigation} />)
    );

    expect(getByText("Tus Reservas")).toBeTruthy();

    await waitFor(() => {
      expect(getByText("Partida 1")).toBeTruthy();
      expect(getByText("Partida 2")).toBeTruthy();
      expect(getByTestId("reservation-item-res-1")).toBeTruthy();
      expect(getByTestId("reservation-item-res-2")).toBeTruthy();
    });
  });

  it("navigates to details only for accepted reservations", async () => {
    const navigation = createNavigation();

    axios.get
      .mockResolvedValueOnce(
        mockReservationsResponse([
          buildReservation({ id: "res-1", estado: "solicitada", inicio: "Pendiente" }),
        ])
      )
      .mockResolvedValueOnce(
        mockReservationsResponse([
          buildReservation({
            id: "res-2",
            estado: "aceptada",
            inicio: "Aceptada",
            llegada: "Destino 2",
            fecha: "2024-10-20",
            hora: "12:00",
          }),
        ])
      );

    const { getByTestId } = render(
      wrapWithNavigation(<Reservations navigation={navigation} />)
    );

    await waitFor(() => {
      expect(getByTestId("reservation-item-res-1")).toBeTruthy();
      expect(getByTestId("reservation-item-res-2")).toBeTruthy();
    });

    fireEvent.press(getByTestId("reservation-item-res-1"));
    expect(navigation.navigate).not.toHaveBeenCalledWith("ServiceDetails", expect.anything());

    navigation.navigate.mockClear();

    fireEvent.press(getByTestId("reservation-item-res-2"));
    expect(navigation.navigate).toHaveBeenCalledWith("ServiceDetails", {
      inicio: "Aceptada",
      llegada: "Destino 2",
      fecha: "2024-10-20",
      hora: "12:00",
    });
  });

  it("navigates to reservation creation flow", async () => {
    const navigation = createNavigation();

    axios.get
      .mockResolvedValueOnce(mockReservationsResponse([]))
      .mockResolvedValueOnce(mockReservationsResponse([]));

    const { getByTestId } = render(
      wrapWithNavigation(<Reservations navigation={navigation} />)
    );

    await waitFor(() => expect(getUser).toHaveBeenCalled());

    fireEvent.press(getByTestId("reservation-create"));

    expect(navigation.navigate).toHaveBeenCalledWith("ReservationRoute");
  });
});
