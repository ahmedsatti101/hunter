import { render, screen } from "@testing-library/react-native"
import Account from "~/app/(tabs)/account";

jest.mock("expo-router", () => {
  const { View } = require("react-native");

  return {
    Stack: {
      Screen: View
    },
    useRouter: () => { }
  }
});

beforeEach(() => {
  render(<Account />);
});

describe("Account page tests", () => {
  test("Log out button should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Sign out" });

    expect(button).toBeOnTheScreen();
    expect(button).not.toBeDisabled();
  });
  test("Update button should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Update" });

    expect(button).toBeOnTheScreen();
    expect(button).not.toBeDisabled();
  });
  test("Username label should be visible on the screen", () => {
    const label = screen.getByRole("text", { name: "Username" });

    expect(label).toBeOnTheScreen();
  });
  test("Text field to change username should be visible on the screen", () => {
    const input = screen.getByTestId("username-text-field");

    expect(input).toBeOnTheScreen();
  });
});
