import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../../screens/home";

jest.mock("../../components/HomeMap/Map", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockMap = () => <Text>Map Mock</Text>;
  MockMap.displayName = "MockMap";
  return MockMap;
});

jest.mock("../../components/HomeMap/Card", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockCard = () => <Text>Card Mock</Text>;
  MockCard.displayName = "MockCard";
  return MockCard;
});

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }) => <View testID="bottom-sheet-mock">{children}</View>;
});

describe("HomeScreen", () => {
  it("renders the map and card inside the bottom sheet", () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    expect(getByText("Map Mock")).toBeTruthy();
    expect(getByTestId("bottom-sheet-mock")).toBeTruthy();
    expect(getByText("Card Mock")).toBeTruthy();
  });
});
