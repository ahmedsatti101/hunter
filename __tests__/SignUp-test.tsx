import { render, screen } from "@testing-library/react-native";
import SignUp from "~/app/sign-up";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    }
  }
});

describe("Sign up screen tests", () => {
  beforeEach(() => {
    render(<SignUp />);
  });

  test("Should display Email field label", () => {
    const emailLabel = screen.getByRole("text", { name: "Email" });

    expect(emailLabel).toBeVisible();
    expect(emailLabel).toBeOnTheScreen();
  });

  test("Should display Create Password field label", () => {
    const passwordLabel = screen.getByRole("text", { name: "Create Password" });

    expect(passwordLabel).toBeVisible();
    expect(passwordLabel).toBeOnTheScreen();
  });

  test("Should display Confirm Password field label", () => {
    const confirmPasswordLabel = screen.getByRole("text", { name: "Confirm Password" });

    expect(confirmPasswordLabel).toBeVisible();
    expect(confirmPasswordLabel).toBeOnTheScreen();
  });

  test("Should display 'Create account' button", () => {
    const button = screen.getByRole("button", { name: "Create account" });

    expect(button).toBeVisible();
    expect(button).toBeOnTheScreen();
  });

  test("Should display email field", () => {
    const emailField = screen.getByTestId("email-input-field");

    expect(emailField).toBeVisible();
    expect(emailField).toBeOnTheScreen();
  });

  test("Should display password field", () => {
    const passwordField = screen.getByTestId("password-input-field");

    expect(passwordField).toBeVisible();
    expect(passwordField).toBeOnTheScreen();
  });

  test("Should display confirm password field", () => {
    const confirmPasswordField = screen.getByTestId("confirm-password-input-field");

    expect(confirmPasswordField).toBeVisible();
    expect(confirmPasswordField).toBeOnTheScreen();
  });
});
