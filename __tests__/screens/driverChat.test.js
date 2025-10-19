import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Chat from "../../screens/driverChat";

const createNavigation = () => ({
  goBack: jest.fn(),
});

const createRoute = (overrides = {}) => ({
  params: {
    driverName: "Juan Perez",
    ...overrides,
  },
});

describe("driverChat screen", () => {
  it("renders header with driver name and initial messages", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByText } = render(<Chat navigation={navigation} route={route} />);

    expect(getByText("Juan Perez")).toBeTruthy();
    expect(getByText("Hola queria hacer una reserva con usted para mover algunas cosas de mi casa")).toBeTruthy();
    expect(getByText("Claro tengo disponible el dia lunes y martes luego de las 3 de la tarde")).toBeTruthy();
  });

  it("allows user to type and send a message", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <Chat navigation={navigation} route={route} />
    );

    const input = getByPlaceholderText("Chat");
    fireEvent.changeText(input, "Mensaje nuevo");
    fireEvent.press(getByLabelText("chat-send-button"));

    expect(getByText("Mensaje nuevo")).toBeTruthy();
    expect(input.props.value).toBe("");
  });

  it("does not send empty messages", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByPlaceholderText, queryAllByText, getByLabelText } = render(
      <Chat navigation={navigation} route={route} />
    );

    const input = getByPlaceholderText("Chat");
    fireEvent.changeText(input, "   ");
    fireEvent.press(getByLabelText("chat-send-button"));

    // Should still have only the initial two messages
    expect(queryAllByText(/Hola queria hacer una reserva/).length).toBe(1);
    expect(queryAllByText(/Claro tengo disponible/).length).toBe(1);
  });

  it("goes back when pressing the back button", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByTestId } = render(<Chat navigation={navigation} route={route} />);

    fireEvent.press(getByTestId("chat-back-button"));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
