import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ReservationRoute from "../../screens/rsvRoute";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    }),
  };
});

jest.mock("../../components/Inputs/searchLocation", () => {
  const React = require("react");
  const { Text, TouchableOpacity } = require("react-native");

  const MockSearchLocation = ({ placeholder, onLocationSelect, onFocus }) => (
    <TouchableOpacity
      testID={`search-${placeholder}`}
      onPress={() => {
        onFocus?.();
        onLocationSelect(`${placeholder}-selected`);
      }}
    >
      <Text>{placeholder}</Text>
    </TouchableOpacity>
  );

  MockSearchLocation.displayName = "MockSearchLocation";
  return MockSearchLocation;
});

jest.mock("../../assets/recent.png", () => 1);

describe("ReservationRoute screen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGoBack.mockClear();
  });

  it("renders inputs and recent routes", () => {
    const { getByText, getAllByText } = render(<ReservationRoute />);

    expect(getByText("Selecciona la Ruta")).toBeTruthy();
    expect(getAllByText("Buscar partida").length).toBeGreaterThan(0);
    expect(getAllByText("Buscar destino").length).toBeGreaterThan(0);
    expect(getAllByText("Jr. Medrano Silva 165, Barranco").length).toBeGreaterThan(0);
  });

  it("fills data from search and continues to vehicle selection", () => {
    const { getByTestId } = render(<ReservationRoute />);

    fireEvent.press(getByTestId("search-Buscar partida"));
    fireEvent.press(getByTestId("search-Buscar destino"));

    fireEvent.changeText(getByTestId("date-input"), "2024-10-20");
    fireEvent.changeText(getByTestId("time-input"), "14:30");

    fireEvent.press(getByTestId("reservation-route-continue"));

    expect(mockNavigate).toHaveBeenCalledWith("RsvChooseVehicle", {
      inicio: "Buscar partida-selected",
      llegada: "Buscar destino-selected",
      fecha: "2024-10-20",
      hora: "14:30",
    });
  });

  it("uses recent route suggestion and navigates back", () => {
    const { getByTestId } = render(<ReservationRoute />);

    fireEvent.press(getByTestId("search-Buscar partida"));
    fireEvent.press(getByTestId("recent-route-1"));

    fireEvent.press(getByTestId("reservation-route-back"));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
