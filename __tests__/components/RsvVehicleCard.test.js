import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RsvVehicleList from "../../components/ChooseVehicle/RsvVehicleCard";

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
        fecha: "2024-10-20",
        hora: "14:30",
      },
    }),
  };
});

jest.mock("../../assets/Van.png", () => 1);
jest.mock("../../assets/Furgoneta.png", () => 1);
jest.mock("../../assets/Camion.png", () => 1);
jest.mock("../../assets/Flete.png", () => 1);

describe("RsvVehicleList component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the list of reservation vehicles", () => {
    const { getByText } = render(<RsvVehicleList />);

    expect(getByText("Van")).toBeTruthy();
    expect(getByText("Furgoneta")).toBeTruthy();
    expect(getByText("Camion")).toBeTruthy();
    expect(getByText("Flete")).toBeTruthy();
  });

  it("toggles selection when tapping vehicles and navigates on continue", () => {
    const { getByTestId } = render(<RsvVehicleList />);

    const vanCard = getByTestId("vehicle-card-1");
    fireEvent.press(vanCard);

    fireEvent.press(vanCard);

    const camionCard = getByTestId("vehicle-card-3");
    fireEvent.press(camionCard);

    fireEvent.press(getByTestId("vehicle-continue"));

    expect(mockNavigate).toHaveBeenCalledWith("AdvConfirmation", {
      originAddress: "Origen",
      destinationAddress: "Destino",
      date: "2024-10-20",
      time: "14:30",
    });
  });
});
