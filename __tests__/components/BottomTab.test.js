import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import BottomTab from "../../components/Navigation/BottomTab";

jest.mock("../../screens/home", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const Mock = () => <Text>Home Screen</Text>;
  Mock.displayName = "HomeScreenMock";
  return Mock;
});

jest.mock("../../screens/reservation", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const Mock = () => <Text>Reservations Screen</Text>;
  Mock.displayName = "ReservationsScreenMock";
  return Mock;
});

jest.mock("../../screens/contact", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const Mock = () => <Text>Contact Screen</Text>;
  Mock.displayName = "ContactScreenMock";
  return Mock;
});

jest.mock("../../screens/profile", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const Mock = () => <Text>Profile Screen</Text>;
  Mock.displayName = "ProfileScreenMock";
  return Mock;
});

describe("BottomTab Navigator", () => {
  const renderTabs = () => {
    const navigationRef = createNavigationContainerRef();
    const utils = render(
      <NavigationContainer ref={navigationRef}>
        <BottomTab />
      </NavigationContainer>
    );
    return { ...utils, navigationRef };
  };

  it("renders all tab icons", () => {
    const { getByText } = renderTabs();

    expect(getByText("home")).toBeTruthy();
    expect(getByText("calendar-outline")).toBeTruthy();
    expect(getByText("call-outline")).toBeTruthy();
    expect(getByText("person-outline")).toBeTruthy();
  });

  it("updates focused tab icon when navigating", async () => {
    const { getByText, navigationRef } = renderTabs();

    await waitFor(() => {
      expect(navigationRef.isReady()).toBe(true);
    });

    act(() => {
      navigationRef.navigate("Reservations");
    });

    await waitFor(() => {
      expect(getByText("calendar")).toBeTruthy();
      expect(getByText("home-outline")).toBeTruthy();
    });
  });
});
