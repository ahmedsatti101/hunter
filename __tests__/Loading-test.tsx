import { render, screen } from "@testing-library/react-native";

import Loading from "../screens/Loading";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    }
  }
})

describe("<Splash />", () => {
  beforeEach(() => {
    render(<Loading />);
  });

  test("Ensure loading screen is visible after splash screen", () => {
    const text = screen.getByText("Loading...");
    expect(text).toBeOnTheScreen();
  });

  test('Loading indication should be visible on the loading screen', () => {
    const indicatior = screen.getByTestId("loading-indicator");
    expect(indicatior).toBeOnTheScreen();
  })
});
