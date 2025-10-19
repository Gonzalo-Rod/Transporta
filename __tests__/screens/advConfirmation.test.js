import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AdvConfirmation from "../../screens/advConfirmation";

const createNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
});

const createRoute = (overrides = {}) => ({
  params: {
    originAddress: "Av. Siempre Viva 123",
    destinationAddress: "Calle Falsa 456",
    date: "10/10/2024",
    time: "15:30",
    ...overrides,
  },
});

describe("AdvConfirmation screen", () => {
  it("renders confirmation details using route params", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByText } = render(
      <AdvConfirmation navigation={navigation} route={route} />
    );

    expect(getByText("El transporte ha sido solicitado")).toBeTruthy();
    expect(getByText("10/10/2024 15:30 GMT-5")).toBeTruthy();
    expect(getByText("Av. Siempre Viva 123")).toBeTruthy();
    expect(getByText("Calle Falsa 456")).toBeTruthy();
    expect(getByText("Origen")).toBeTruthy();
    expect(getByText("Destino")).toBeTruthy();
  });

  it("navigates to reservations when pressing Detalles", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByText } = render(
      <AdvConfirmation navigation={navigation} route={route} />
    );

    fireEvent.press(getByText("Detalles"));

    expect(navigation.navigate).toHaveBeenCalledWith("Main", {
      screen: "Reservations",
    });
  });

  it("navigates to Home when pressing Volver al Inicio", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByText } = render(
      <AdvConfirmation navigation={navigation} route={route} />
    );

    fireEvent.press(getByText("Volver al Inicio"));

    expect(navigation.navigate).toHaveBeenCalledWith("Home");
  });

  it("goes back when pressing the header back button", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByTestId } = render(
      <AdvConfirmation navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId("adv-back-button"));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
