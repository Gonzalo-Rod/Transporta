import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DetailsCard from "../../components/ServiceDetails/DetailsCard";

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
        inicio: "Origen Test",
        llegada: "Destino Test",
        fecha: "2024-10-20",
        hora: "12:30:00",
      },
    }),
  };
});

jest.mock("../../assets/ConductorTemp.png", () => 1);
jest.mock("../../assets/Visa.png", () => 1);

describe("DetailsCard component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders driver info, route details, payment, and formatted date", () => {
    const { getByText } = render(<DetailsCard />);

    expect(getByText("Pedro Lopez Alvarez")).toBeTruthy();
    expect(getByText("AEZ037")).toBeTruthy();
    expect(getByText("HYUNDAI Negro")).toBeTruthy();
    expect(getByText("Origen Test")).toBeTruthy();
    expect(getByText("Destino Test")).toBeTruthy();
    expect(getByText("**** 1234")).toBeTruthy();
    expect(getByText("S/. 100")).toBeTruthy();
  });

  it("navigates to driver profile and home when actions are pressed", () => {
    const { getByTestId } = render(<DetailsCard />);

    fireEvent.press(getByTestId("details-driver-card"));
    expect(mockNavigate).toHaveBeenCalledWith("DriverProfile", {
      driver: expect.objectContaining({
        name: "Pedro Lopez Alvarez",
        plate: "AEZ037",
      }),
    });

    mockNavigate.mockClear();

    fireEvent.press(getByTestId("details-cancel"));
    expect(mockNavigate).toHaveBeenCalledWith("Home");
  });
});
