import React from "react";
import { render } from "@testing-library/react-native";
import Map from "../../components/HomeMap/Map";

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockMapView = ({ testID, initialRegion }) => (
    <View testID={testID} initialRegion={initialRegion} />
  );

  return {
    __esModule: true,
    default: MockMapView,
    Marker: ({ testID }) => <View testID={testID} />,
  };
});

describe("Home Map component", () => {
  it("renders MapView with initial region", () => {
    const { getByTestId } = render(<Map />);

    const map = getByTestId("home-map");
    expect(map).toBeTruthy();
  });
});
