import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ChooseVehicle from "../../screens/chooseVehicle";

const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock("react-native-vector-icons/Ionicons", () => "Ionicons");

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");

  return ({ children }) => <View testID="bottom-sheet-mock">{children}</View>;
});

jest.mock("../../components/HomeMap/MapDetails", () => {
  const React = require("react");
  const { Text } = require("react-native");

  const MockMapDetails = () => <Text>MapDetails</Text>;
  MockMapDetails.displayName = "MockMapDetails";
  return MockMapDetails;
});

jest.mock("../../components/ChooseVehicle/VehicleCard", () => {
  const React = require("react");
  const { Text } = require("react-native");

  const MockVehicleList = () => <Text>VehicleList</Text>;
  MockVehicleList.displayName = "MockVehicleList";
  return MockVehicleList;
});

describe("ChooseVehicle screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGoBack.mockClear();
  });

  it("renders map details and vehicle list inside the bottom sheet", () => {
    const { getByText, getByTestId } = render(<ChooseVehicle />);

    expect(getByText("MapDetails")).toBeTruthy();
    expect(getByTestId("bottom-sheet-mock")).toBeTruthy();
    expect(getByText("VehicleList")).toBeTruthy();
  });

  it("calls navigation.goBack when the back button is pressed", () => {
    const { getByTestId } = render(<ChooseVehicle />);

    fireEvent.press(getByTestId("choose-vehicle-back"));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
