import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    NavigationContainer: ({ children }) => <>{children}</>,
  };
});

const stackScreens = [];
jest.mock("@react-navigation/native-stack", () => {
  const React = require("react");
  const Navigator = ({ children }) => <>{children}</>;
  const Screen = (props) => {
    stackScreens.push(props);
    return null;
  };
  return {
    createNativeStackNavigator: () => ({ Navigator, Screen }),
    __stackScreens: stackScreens,
  };
});

jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    GestureHandlerRootView: ({ children, ...props }) => (
      <View {...props} testID="gesture-root">
        {children}
      </View>
    ),
  };
});

jest.mock("../components/Navigation/BottomTab", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const Mock = () => <Text>Bottom Tab</Text>;
  Mock.displayName = "BottomTabMock";
  return Mock;
});

const mockScreen = (label) => () => {
  const React = require("react");
  const { Text } = require("react-native");
  return <Text>{label}</Text>;
};

jest.mock("../screens/register", () => mockScreen("Register"));
jest.mock("../screens/login", () => mockScreen("Login"));
jest.mock("../screens/route", () => mockScreen("Route"));
jest.mock("../screens/drivers", () => mockScreen("Drivers"));
jest.mock("../screens/driverProfile", () => mockScreen("DriverProfile"));
jest.mock("../screens/driverChat", () => mockScreen("Chat"));
jest.mock("../screens/advReservation", () => mockScreen("AdvReservation"));
jest.mock("../screens/advConfirmation", () => mockScreen("AdvConfirmation"));
jest.mock("../screens/profile", () => mockScreen("Profile"));
jest.mock("../screens/payment", () => mockScreen("Payment"));
jest.mock("../screens/addCard", () => mockScreen("AddCard"));
jest.mock("../screens/actividad", () => mockScreen("Activity"));
jest.mock("../screens/reservation", () => mockScreen("Reservations"));
jest.mock("../screens/rsvRoute", () => mockScreen("ReservationRoute"));
jest.mock("../screens/chooseVehicle", () => mockScreen("ChooseVehicle"));
jest.mock("../components/ServiceDetails/DetailsCard", () => mockScreen("DetailsCard"));
jest.mock("../screens/serviceDetails", () => mockScreen("ServiceDetails"));
jest.mock("../screens/RsvchooseVehicle", () => mockScreen("RsvChooseVehicle"));
jest.mock("../components/Inputs/searchLocation", () => mockScreen("SearchLocation"));
jest.mock("../components/HomeMap/MapDetails", () => mockScreen("MapDetails"));
jest.mock("../components/ChooseVehicle/RsvVehicleCard", () => mockScreen("RsvVehicleList"));

const { __stackScreens } = require("@react-navigation/native-stack");

describe("App", () => {
  beforeEach(() => {
    __stackScreens.length = 0;
  });

  it("renders gesture root and navigation container", () => {
    const App = require("../App").default;
    const { getByTestId } = render(<App />);

    expect(getByTestId("gesture-root")).toBeTruthy();
  });

  it("registers all expected stack screens", () => {
    const App = require("../App").default;
    render(<App />);

    const registered = __stackScreens.map((screen) => screen.name);

    expect(registered).toEqual([
      "Login",
      "Register",
      "Main",
      "Route",
      "Drivers",
      "DriverProfile",
      "AdvReservation",
      "AdvConfirmation",
      "UserProfile",
      "PaymentInfo",
      "AddCreditCard",
      "Activity",
      "Chat",
      "Reservations",
      "ReservationRoute",
      "ChooseVehicle",
      "ServiceDetails",
      "DetailsCard",
      "SearchLocation",
      "MapDetails",
      "RsvVehicleList",
      "RsvChooseVehicle",
    ]);
  });
});
