import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Route from "../../screens/route";

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

  return MockSearchLocation;
});

jest.mock("../../assets/recent.png", () => 1);

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

describe("Route screen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGoBack.mockClear();
  });

  it("renders header, search inputs, and recent routes", () => {
    const { getByText, getAllByText } = render(
      <Route />
    );

    expect(getByText("Selecciona la Ruta")).toBeTruthy();
    expect(getAllByText("Buscar partida").length).toBeGreaterThan(0);
    expect(getAllByText("Buscar destino").length).toBeGreaterThan(0);
    expect(getAllByText("Jr. Medrano Silva 165, Barranco").length).toBeGreaterThan(0);
  });

  it("fills inputs from search components and continues to vehicle selection", () => {
    const { getByTestId } = render(<Route />);

    fireEvent.press(getByTestId("search-Buscar partida"));
    fireEvent.press(getByTestId("search-Buscar destino"));

    fireEvent.press(getByTestId("route-continue"));

    expect(mockNavigate).toHaveBeenCalledWith("ChooseVehicle", {
      inicio: "Buscar partida-selected",
      llegada: "Buscar destino-selected",
    });
  });

  it("populates fields using recent routes and back navigates", () => {
    const { getByTestId } = render(<Route />);

    fireEvent.press(getByTestId("search-Buscar partida"));
    fireEvent.press(getByTestId("search-Buscar destino"));

    fireEvent.press(getByTestId("recent-route-1"));

    fireEvent.press(getByTestId("route-back"));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
