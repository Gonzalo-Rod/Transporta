module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?@?react-native|@react-native-async-storage|@react-navigation|@gorhom|expo(nent)?|@expo(nent)?|expo-modules-core|@expo-google-fonts|react-clone-referenced-element|react-native|react-native-.*|@react-native-.*)/)",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/backend/"],
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgMock.js",
    "\\.(jpg|jpeg|png|gif|webp|ico|bmp)$": "<rootDir>/__mocks__/fileMock.js",
  },
};
