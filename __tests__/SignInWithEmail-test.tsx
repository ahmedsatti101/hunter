import SignInWithEmail from "~/app/sign-in";
import { render, screen, userEvent } from "@testing-library/react-native";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    }
  }
});

describe("SignInWithEmail tests", () => {
  beforeEach(() => {
    render(<SignInWithEmail />);
  });

  test("Should display 'Sign in' header on screen", () => {
    const text = screen.getByTestId("signin-screen-header");

    expect(text).toBeVisible();
    expect(text).toBeOnTheScreen();
  });

  test("Should display Email field label", () => {
    const emailLabel = screen.getByRole("text", { name: "Email" });

    expect(emailLabel).toBeVisible();
    expect(emailLabel).toBeOnTheScreen();
  });

  test("Should display Password field label", () => {
    const passwordLabel = screen.getByRole("text", { name: "Password" });

    expect(passwordLabel).toBeVisible();
    expect(passwordLabel).toBeOnTheScreen();
  });

  test("Should display 'Forgot password?' text", () => {
    const text = screen.getByRole("text", { name: "Forgot password?" });

    expect(text).toBeVisible();
    expect(text).toBeOnTheScreen();
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

  test("Should display 'Sign in' button", () => {
    const button = screen.getByRole("button", { name: "Sign in" });

    expect(button).toBeVisible();
    expect(button).toBeOnTheScreen();
  });
});
