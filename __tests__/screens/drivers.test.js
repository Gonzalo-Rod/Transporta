import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DriversList from "../../screens/drivers";

jest.mock("../../assets/ConductorTemp.png", () => 1);

const createNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
});

const buildDriver = (overrides = {}) => ({
  placa: { S: "XYZ123" },
  nombre_conductor: { S: "Carlos" },
  apellido_conductor: { S: "Gomez" },
  correo_conductor: { S: "carlos@example.com" },
  telefono: { S: "999999999" },
  tipo_transporte: { S: "Camion" },
  dimensiones: {
    M: {
      ancho: { S: "2" },
      largo: { S: "5" },
      altura: { S: "3" },
    },
  },
  ...overrides,
});

const createRoute = (drivers = []) => ({
  params: {
    vehiculos: drivers,
  },
});

describe("DriversList screen", () => {
  it("renders driver cards with data", () => {
    const navigation = createNavigation();
    const route = createRoute([buildDriver()]);

    const { getByText } = render(
      <DriversList navigation={navigation} route={route} />
    );

    expect(getByText("Conductores")).toBeTruthy();
    expect(getByText("Carlos Gomez")).toBeTruthy();
    expect(getByText("Vehiculo: Camion")).toBeTruthy();
    expect(getByText("Dimensiones: 2 x 5 x 3")).toBeTruthy();
  });

  it("filters drivers list when typing in search", () => {
    const navigation = createNavigation();
    const drivers = [
      buildDriver({ nombre_conductor: { S: "Carlos" }, placa: { S: "ABC123" } }),
      buildDriver({ nombre_conductor: { S: "Juan" }, placa: { S: "DEF456" } }),
    ];
    const route = createRoute(drivers);

    const { getByPlaceholderText, queryByText } = render(
      <DriversList navigation={navigation} route={route} />
    );

    const searchInput = getByPlaceholderText("Busca");
    fireEvent.changeText(searchInput, "Juan");

    expect(queryByText("Carlos Gomez")).toBeNull();
    expect(queryByText("Juan Gomez")).not.toBeNull();
  });

  it("navigates to driver profile when pressing a driver card", () => {
    const navigation = createNavigation();
    const driver = buildDriver({ nombre_conductor: { S: "Carlos" }, placa: { S: "ABC123" } });
    const route = createRoute([driver]);

    const { getByTestId } = render(
      <DriversList navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId("driver-card-ABC123"));

    expect(navigation.navigate).toHaveBeenCalledWith("DriverProfile", {
      driver: expect.objectContaining({
        name: "Carlos",
        plate: "ABC123",
      }),
    });
  });

  it("goes back when pressing the header back button", () => {
    const navigation = createNavigation();
    const route = createRoute([]);

    const { getByTestId } = render(
      <DriversList navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId("drivers-back"));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
