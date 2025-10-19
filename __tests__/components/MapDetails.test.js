import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import MapDetails from "../../components/HomeMap/MapDetails";

const mockFitToCoordinates = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useRoute: () => ({
      params: {
        inicio: "Av. Siempre Viva 123",
        llegada: "Jr. Las Flores 456",
      },
    }),
  };
});

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockMapView = React.forwardRef(({ children, testID, ...props }, ref) => {
    React.useImperativeHandle(ref, () => ({
      fitToCoordinates: mockFitToCoordinates,
    }));

    return (
      <View testID={testID} {...props}>
        {children}
      </View>
    );
  });

  MockMapView.displayName = "MockMapView";

  const Marker = ({ testID }) => <View testID={testID} />;
  const Polyline = ({ testID }) => <View testID={testID} />;

  return {
    __esModule: true,
    default: MockMapView,
    Marker,
    Polyline,
  };
});

global.fetch = jest.fn();

describe("MapDetails component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches coordinates and renders markers and polyline", async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ lat: -12.05, lng: -77.02 }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ lat: -12.06, lng: -77.03 }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            status: "OK",
            routes: [
              {
                overview_polyline: {
                  points: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
                },
              },
            ],
          }),
      });

    const { getByTestId } = render(<MapDetails />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));

    expect(getByTestId("map-details")).toBeTruthy();
    expect(getByTestId("origin-marker")).toBeTruthy();
    expect(getByTestId("destination-marker")).toBeTruthy();
    expect(getByTestId("route-polyline")).toBeTruthy();
    expect(mockFitToCoordinates).toHaveBeenCalled();
  });
});
