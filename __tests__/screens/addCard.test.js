import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AddCreditCard from "../../screens/addCard";

const createNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
});

describe("AddCreditCard screen", () => {
  it("renders static elements correctly", () => {
    const navigation = createNavigation();
    const { getByText, getByPlaceholderText } = render(<AddCreditCard navigation={navigation} />);

    expect(getByText("Agregar método de pago")).toBeTruthy();
    expect(getByText("Guardar")).toBeTruthy();
    expect(getByPlaceholderText("Nombre del titular")).toBeTruthy();
    expect(getByPlaceholderText("Número de la tarjeta")).toBeTruthy();
    expect(getByPlaceholderText("MM/YY")).toBeTruthy();
    expect(getByPlaceholderText("CVV")).toBeTruthy();
  });

  it("updates card preview as the user types", () => {
    const navigation = createNavigation();
    const { getByPlaceholderText, getByText } = render(<AddCreditCard navigation={navigation} />);

    fireEvent.changeText(getByPlaceholderText("Nombre del titular"), "Jane Doe");
    fireEvent.changeText(getByPlaceholderText("Número de la tarjeta"), "1234123412341234");
    fireEvent.changeText(getByPlaceholderText("MM/YY"), "12/30");

    expect(getByText("Jane Doe")).toBeTruthy();
    expect(getByText("1234123412341234")).toBeTruthy();
    expect(getByText("12/30")).toBeTruthy();
  });

  it("navigates to payment info after saving", () => {
    const navigation = createNavigation();
    const { getByText } = render(<AddCreditCard navigation={navigation} />);

    fireEvent.press(getByText("Guardar"));

    expect(navigation.navigate).toHaveBeenCalledWith("PaymentInfo");
  });

  it("goes back when pressing the header back button", () => {
    const navigation = createNavigation();
    const { getByTestId } = render(<AddCreditCard navigation={navigation} />);

    fireEvent.press(getByTestId("back-button"));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
