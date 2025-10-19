import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RsvChooseVehicle from "../../screens/RsvchooseVehicle";

const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
  };
});

jest.mock("../../components/HomeMap/MapDetails", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockMapDetails = () => <Text>MapDetails</Text>;
  MockMapDetails.displayName = "MockMapDetails";
  return MockMapDetails;
});

jest.mock("../../components/ChooseVehicle/RsvVehicleCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockVehicleList = () => <Text>Reservation Vehicles</Text>;
  MockVehicleList.displayName = "MockVehicleList";
  return MockVehicleList;
});

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }) => <View testID="bottom-sheet-mock">{children}</View>;
});

jest.mock("react-native-vector-icons/Ionicons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ name }) => <Text>{`Icon:${name}`}</Text>;
});

describe("RsvChooseVehicle screen", () => {
  it("renders map, vehicle list and back button", () => {
    const { getByText, getByTestId } = render(<RsvChooseVehicle />);

    expect(getByText("MapDetails")).toBeTruthy();
    expect(getByText("Reservation Vehicles")).toBeTruthy();
    expect(getByTestId("bottom-sheet-mock")).toBeTruthy();
  });

  it("navigates back when the back button is pressed", () => {
    mockGoBack.mockClear();

    const { getByTestId } = render(<RsvChooseVehicle />);

    fireEvent.press(getByTestId("rsv-choose-back"));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
