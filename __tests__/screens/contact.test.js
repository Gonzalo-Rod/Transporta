import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ContactScreen from "../../screens/contact";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../assets/ConductorTemp.png", () => 1);
jest.mock("../../assets/Van.png", () => 1);
jest.mock("../../assets/Furgoneta.png", () => 1);
jest.mock("../../assets/Camion.png", () => 1);
jest.mock("../../assets/Flete.png", () => 1);
jest.mock("../../assets/Instrumentos.png", () => 1);
jest.mock("../../assets/Mudanzas.png", () => 1);
jest.mock("../../assets/Eventos.png", () => 1);
jest.mock("../../assets/Fragil.png", () => 1);

const axios = require("axios");

const createNavigation = () => ({
  navigate: jest.fn(),
});

const mockResponseData = [
  { id: "driver-1", nombre: "Juan Perez" },
  { id: "driver-2", nombre: "Maria Gomez" },
];

describe("ContactScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: { response: mockResponseData } });
  });

  it("renders the main sections and sample driver list", () => {
    const navigation = createNavigation();
    const { getByText, getAllByText } = render(<ContactScreen navigation={navigation} />);

    expect(getByText("Vehiculos")).toBeTruthy();
    expect(getByText("Carga")).toBeTruthy();
    expect(getByText("Empresas")).toBeTruthy();
    expect(getByText("Conductores")).toBeTruthy();

    expect(getAllByText("Van").length).toBeGreaterThan(0);
    expect(getByText("Instrumentos")).toBeTruthy();
    expect(getByText("Empresa A")).toBeTruthy();
    expect(getByText("Pedro Lopez")).toBeTruthy();
  });

  it("applies the vehicle filter and navigates to Drivers with API response", async () => {
    const navigation = createNavigation();
    const { getAllByText } = render(<ContactScreen navigation={navigation} />);

    fireEvent.press(getAllByText("Van")[0]);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/get-vehiculos?parametro=tipo_transporte&valor=van",
        { headers: { "Content-Type": "application/json" } }
      );
      expect(navigation.navigate).toHaveBeenCalledWith("Drivers", { vehiculos: mockResponseData });
    });
  });

  it("applies the cargo filter", async () => {
    const navigation = createNavigation();
    const { getByText } = render(<ContactScreen navigation={navigation} />);

    fireEvent.press(getByText("Instrumentos"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/get-vehiculos?parametro=tipo_carga&valor=instrumentos",
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  it("applies the enterprise filter", async () => {
    const navigation = createNavigation();
    const { getByText } = render(<ContactScreen navigation={navigation} />);

    fireEvent.press(getByText("Empresa A"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/get-vehiculos?parametro=empresa&valor=empresa%20a",
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  it("shows all drivers when tapping the Conductores chevron", async () => {
    const navigation = createNavigation();
    const { getByTestId } = render(<ContactScreen navigation={navigation} />);

    fireEvent.press(getByTestId("drivers-forward"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/get-vehiculos",
        { headers: { "Content-Type": "application/json" } }
      );
      expect(navigation.navigate).toHaveBeenCalledWith("Drivers", { vehiculos: mockResponseData });
    });
  });

  it("navigates to the driver profile when a driver card is pressed", () => {
    const navigation = createNavigation();
    const { getByText } = render(<ContactScreen navigation={navigation} />);

    fireEvent.press(getByText("Pedro Lopez"));

    expect(navigation.navigate).toHaveBeenCalledWith("DriverProfile", {
      driver: expect.objectContaining({ id: "1", name: "Pedro Lopez" }),
    });
  });
});
