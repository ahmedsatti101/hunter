import { render, screen } from "@testing-library/react-native";
import Index from "../app/index";
import RootLayout from "../app/_layout";

describe("App theme tests", () => {
  beforeEach(() => {
    render(<RootLayout />);
  });
  test("Toggle theme button should be visible on screen", () => {
    const toggleButton = screen.getByTestId("toggle-theme-btn");

    expect(toggleButton).toBeOnTheScreen();
  });
});
