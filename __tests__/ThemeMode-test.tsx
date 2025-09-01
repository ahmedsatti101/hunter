import { render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";
import ThemeToggle from "~/components/ThemeToggle";

describe("App theme tests", () => {
  test("Toggle theme button should be visible on screen", () => {
    render(
      <ThemeToggle />,
    );
    const toggleButton = screen.getByTestId("toggle-theme-btn");

    expect(toggleButton).toBeOnTheScreen();
  });
});
