import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import DriverProfile from "../../screens/driverProfile";

jest.mock("../../assets/ConductorTemp.png", () => 1);

const baseDriver = {
  id: "1",
  name: "Pedro",
  lastname: "Lopez",
  rating: 4.5,
  image: require("../../assets/ConductorTemp.png"),
  plate: "ABC123",
  vehicle: "van",
  ancho: 2,
  largo: 4,
  altura: 3,
  availability: "9am - 6pm",
  mail: "driver@example.com",
  phone: "999123456",
};

const createNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
});

const createRoute = (overrides = {}) => ({
  params: {
    driver: { ...baseDriver, ...overrides },
  },
});

describe("DriverProfile screen", () => {
  it("renders driver information and rating", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByText } = render(
      <DriverProfile navigation={navigation} route={route} />
    );

    expect(getByText("Conductor")).toBeTruthy();
    expect(getByText("Pedro Lopez")).toBeTruthy();
    expect(getByText("4.50")).toBeTruthy();
    expect(getByText("ABC123")).toBeTruthy();
    expect(getByText("Van")).toBeTruthy();
    expect(getByText("2 x 4 x 3")).toBeTruthy();
    expect(getByText("9am - 6pm")).toBeTruthy();
  });

  it("goes back when pressing the header back button", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByTestId } = render(
      <DriverProfile navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId("driver-profile-back"));

    expect(navigation.goBack).toHaveBeenCalled();
  });

  it("navigates to chat passing driver name", () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByTestId } = render(
      <DriverProfile navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId("driver-profile-contact"));

    expect(navigation.navigate).toHaveBeenCalledWith("Chat", {
      driverName: "Pedro",
    });
  });

  it("navigates to advanced reservation with driver data", async () => {
    const navigation = createNavigation();
    const route = createRoute();

    const { getByTestId } = render(
      <DriverProfile navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId("driver-profile-reserve"));

    await waitFor(() =>
      expect(navigation.navigate).toHaveBeenCalledWith(
        "AdvReservation",
        expect.objectContaining({
          driverData: expect.objectContaining({ id: "1" }),
        })
      )
    );
  });
});
