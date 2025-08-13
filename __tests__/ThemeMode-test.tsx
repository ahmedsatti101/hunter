import { render, screen, userEvent } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import ThemeToggle from "~/components/ThemeToggle";
import { useState } from "react";
import Index from "~/app";

describe("App theme tests", () => {
  test("Toggle theme button should be visible on screen", () => {
    render(
      <ThemeToggle
        themeMode={null}
        toggleTheme={() => {}}
        isDarkColorScheme={false}
      />,
    );
    const toggleButton = screen.getByTestId("toggle-theme-btn");

    expect(toggleButton).toBeOnTheScreen();
  });
  test("Toggle theme button should be pressable", async () => {
    const mockToggleTheme = jest.fn();
    render(
      <ThemeToggle
        themeMode={null}
        toggleTheme={mockToggleTheme}
        isDarkColorScheme={false}
      />,
    );
    const toggleButton = screen.getByTestId("toggle-theme-btn");
    const user = userEvent.setup();

    await user.press(toggleButton);

    expect(mockToggleTheme).toBeCalled();
    expect(mockToggleTheme).toBeCalledTimes(1);
  });
  test("When theme toggle button is pressed/clicked, the icon should change accordingly", async () => {
    function TestComponent() {
      const [themeMode, setThemeMode] = useState<string | null>(null);
      const mockToggleTheme = () => {
        setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
      };
      return (
        <ThemeToggle
          themeMode={themeMode}
          toggleTheme={mockToggleTheme}
          isDarkColorScheme={false}
        />
      );
    }
    const { queryAllByTestId, getByTestId } = render(<TestComponent />);
    const toggleButton = getByTestId("toggle-theme-btn");
    const user = userEvent.setup();

    await user.press(toggleButton);

    const sunIcon = queryAllByTestId("sun-icon");
    expect(sunIcon).not.toBeNull();
    expect(sunIcon[0]).toBeOnTheScreen();
    expect(queryAllByTestId("moon-icon")).toHaveLength(0);
  });
});
