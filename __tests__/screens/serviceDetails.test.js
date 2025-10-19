import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ServiceDetails from "../../screens/serviceDetails";

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
  const MockMap = () => <Text>MapMock</Text>;
  MockMap.displayName = "MockMap";
  return MockMap;
});

jest.mock("../../components/ServiceDetails/DetailsCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockCard = () => <Text>DetailsCardMock</Text>;
  MockCard.displayName = "MockDetailsCard";
  return MockCard;
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

describe("ServiceDetails screen", () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

  it("renders map and details card inside the bottom sheet", () => {
    const { getByText, getByTestId } = render(<ServiceDetails />);

    expect(getByText("MapMock")).toBeTruthy();
    expect(getByText("DetailsCardMock")).toBeTruthy();
    expect(getByTestId("bottom-sheet-mock")).toBeTruthy();
  });

  it("goes back when pressing the back button", () => {
    const { getByTestId } = render(<ServiceDetails />);

    fireEvent.press(getByTestId("service-details-back"));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
