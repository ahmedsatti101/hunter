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

  test("Password requirements should be displayed on the screen", () => {
    const passwordReqs = screen.findAllByTestId("password-requirements");

    passwordReqs.then((requirements) => {
      expect(requirements).not.toBeNull();
      expect(requirements.length).toEqual(5);

      for (const req of requirements) {
        expect(req).toBeVisible();
        expect(req).toBeOnTheScreen();
      };
    });
  });

  test("When trying to submit an empty form, error messages should be on the screen", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.press(submitButton);

    expect(screen.getByText("Email is required")).toBeOnTheScreen();
    expect(screen.getByText("Password is required")).toBeOnTheScreen();
  });

  test("When providing an invalid email address, the text 'Invalid email format' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign in" });
    const emailInput = screen.getByTestId("email-input-field");

    await user.type(emailInput, "john.doe@")
    await user.press(submitButton);

    expect(screen.getByText("Invalid email format")).toBeOnTheScreen();
  });

  test("When providing a password that is too short, the text 'Password too short' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign in" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "fjr434")
    await user.press(submitButton);

    expect(screen.getByText("Password too short")).toBeOnTheScreen();
  });

  test("When providing a password without at least one digit, the text 'Missing at least one digit' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign in" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "fjrfrjkehfjrfrnehkbfr")
    await user.press(submitButton);

    expect(screen.getByText("Missing at least one digit")).toBeOnTheScreen();
  });

  test("When providing a password without at least one lowercase character, the text 'Missing lowercase character' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign in" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "JHGJHHGJHJBJHJ6")
    await user.press(submitButton);

    expect(screen.getByText("Missing lowercase character")).toBeOnTheScreen();
  });

  test("When providing a password without at least one uppercase character, the text 'Missing uppercase character' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign in" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "efhberhfbrhjbf57")
    await user.press(submitButton);

    expect(screen.getByText("Missing uppercase character")).toBeOnTheScreen();
  });

  test("When providing a password without at least one special character, the text 'Missing special character' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign in" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "efhberhfHGJHbrhjbf57")
    await user.press(submitButton);

    expect(screen.getByText("Missing special character")).toBeOnTheScreen();
  });
});
