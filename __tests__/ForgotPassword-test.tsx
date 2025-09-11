import { render, screen } from "@testing-library/react-native";
import ForgotPassword from "~/app/forgot-password";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    }
  }
});

describe("<ForgotPassword /> tests", () => {
  beforeEach(() => {
    render(<ForgotPassword />);
  });

  test("The text 'Forgot password?' should be on the screen", () => {
    const text = screen.getByText("Forgot password?");

    expect(text).toBeOnTheScreen();
    expect(text).toBeVisible();
  });

  test("The text 'Enter your email to reset your password' should be on the screen", () => {
    const text = screen.getByText("Enter your email to reset your password");

    expect(text).toBeOnTheScreen();
    expect(text).toBeVisible();
  });

  test("Form submit button should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Reset password", disabled: false });

    expect(button).toBeOnTheScreen();
    expect(button).toBeVisible();
  });

  test("Email field label should be on the screen", () => {
    const label = screen.getByTestId("email-label");

    expect(label).toBeOnTheScreen();
    expect(label).toBeVisible();
  });

  test("Email input field should be on the screen", () => {
    const input = screen.getByTestId("email-input-field");

    expect(input).toBeOnTheScreen();
    expect(input).toBeVisible();
  });
});
