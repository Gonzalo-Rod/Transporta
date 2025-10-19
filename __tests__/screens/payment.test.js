import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PaymentInfo from "../../screens/payment";

const createNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
});

describe("PaymentInfo screen", () => {
  it("renders the payment methods and highlights the selected one", () => {
    const navigation = createNavigation();

    const { getAllByText, getByText, getByTestId } = render(
      <PaymentInfo navigation={navigation} />
    );

    expect(getByText("Pago")).toBeTruthy();
    expect(getAllByText("**** 1234").length).toBeGreaterThan(0);
    expect(getByText("Efectivo")).toBeTruthy();
    expect(getByTestId("payment-method-visa1").props.accessibilityState.selected).toBe(true);
  });

  it("changes selected payment method when a card is tapped", () => {
    const navigation = createNavigation();

    const { getByTestId } = render(
      <PaymentInfo navigation={navigation} />
    );

    expect(getByTestId("payment-method-visa1").props.accessibilityState.selected).toBe(true);

    fireEvent.press(getByTestId("payment-method-visa2"));

    expect(getByTestId("payment-method-visa2").props.accessibilityState.selected).toBe(true);
    expect(getByTestId("payment-method-visa1").props.accessibilityState.selected).toBe(false);
  });

  it("navigates to AddCreditCard when pressing the add button", () => {
    const navigation = createNavigation();

    const { getByTestId } = render(<PaymentInfo navigation={navigation} />);

    fireEvent.press(getByTestId("payment-add-method"));

    expect(navigation.navigate).toHaveBeenCalledWith("AddCreditCard");
  });

  it("goes back when pressing the header back button", () => {
    const navigation = createNavigation();

    const { getByTestId } = render(<PaymentInfo navigation={navigation} />);

    fireEvent.press(getByTestId("payment-back"));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
