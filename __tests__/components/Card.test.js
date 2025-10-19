import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Card from "../../components/HomeMap/Card";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock("../../assets/Busca.png", () => 1);
jest.mock("../../assets/Reserva.png", () => 1);
jest.mock("../../assets/Contacta.png", () => 1);

describe("Home Card component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders greeting and buttons", () => {
    const { getByText } = render(<Card />);

    expect(getByText("Hola Usuario!")).toBeTruthy();
    expect(getByText("Qué quieres hacer?")).toBeTruthy();
    expect(getByText("Búsqueda Inmediata")).toBeTruthy();
    expect(getByText("Reserva")).toBeTruthy();
    expect(getByText("Contacta")).toBeTruthy();
  });

  it("navigates to respective screens when pressing buttons", () => {
    const { getByTestId } = render(<Card />);

    fireEvent.press(getByTestId("card-route"));
    expect(mockNavigate).toHaveBeenCalledWith("Route");

    fireEvent.press(getByTestId("card-reservations"));
    expect(mockNavigate).toHaveBeenCalledWith("Reservations");

    fireEvent.press(getByTestId("card-contact"));
    expect(mockNavigate).toHaveBeenCalledWith("Contact");
  });
});
