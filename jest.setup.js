import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  const MockIcon = ({ name }) => React.createElement(Text, null, name || "Icon");

  MockIcon.propTypes = {
    name: require("prop-types").string,
  };

  return {
    FontAwesome: MockIcon,
    MaterialIcons: MockIcon,
    Ionicons: MockIcon,
  };
});

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  const PropTypes = require("prop-types");

  const MockLinearGradient = ({ children, ...props }) =>
    React.createElement(View, props, children);

  MockLinearGradient.propTypes = {
    children: PropTypes.node,
  };

  return { LinearGradient: MockLinearGradient };
});
