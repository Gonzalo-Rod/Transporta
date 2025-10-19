import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import VehicleList from "../../components/ChooseVehicle/VehicleCard";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
    useRoute: () => ({
      params: {
        inicio: "Origen",
        llegada: "Destino",
      },
    }),
  };
});

jest.mock("../../assets/Van.png", () => 1);
jest.mock("../../assets/Furgoneta.png", () => 1);
jest.mock("../../assets/Camion.png", () => 1);
jest.mock("../../assets/Flete.png", () => 1);

describe("VehicleList component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders available vehicles", () => {
    const { getByText } = render(<VehicleList />);

    expect(getByText("Van")).toBeTruthy();
    expect(getByText("Furgoneta")).toBeTruthy();
    expect(getByText("Camion")).toBeTruthy();
    expect(getByText("Flete")).toBeTruthy();
  });

  it("toggles selection and navigates to service details with context", () => {
    const { getByTestId, queryByTestId } = render(<VehicleList />);

    const defaultCard = getByTestId("vehicle-card-1");
    fireEvent.press(defaultCard);

    expect(queryByTestId("vehicle-continue")).toBeNull();

    const camionCard = getByTestId("vehicle-card-3");
    fireEvent.press(camionCard);

    const continueButton = getByTestId("vehicle-continue");
    fireEvent.press(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "ServiceDetails",
      expect.objectContaining({
        inicio: "Origen",
        llegada: "Destino",
        fecha: expect.any(String),
        hora: expect.any(String),
      })
    );
  });
});
