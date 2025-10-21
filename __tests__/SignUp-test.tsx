import { render, screen, userEvent } from "@testing-library/react-native";
import SignUp from "~/app/sign-up";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    },
    useRouter: () => { }
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

  test("Should display 'Sign up' button", () => {
    const button = screen.getByRole("button", { name: "Sign up" });

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
    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.press(submitButton);

    expect(screen.getByText("Email is required")).toBeOnTheScreen();
    expect(screen.getByText("Password is required")).toBeOnTheScreen();
    expect(screen.getByText("Please retype your password")).toBeOnTheScreen();
  });

  test("When providing an invalid email address, the text 'Invalid email format' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign up" });
    const emailInput = screen.getByTestId("email-input-field");

    await user.type(emailInput, "john.doe@")
    await user.press(submitButton);

    expect(screen.getByText("Invalid email format")).toBeOnTheScreen();
  });

  test("When providing a password that is too short, the text 'Password too short' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign up" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "fjr434")
    await user.press(submitButton);

    expect(screen.getByText("Password too short")).toBeOnTheScreen();
  });

  test("When providing a password without at least one digit, the text 'Missing at least one digit' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign up" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "fjrfrjkehfjrfrnehkbfr")
    await user.press(submitButton);

    expect(screen.getByText("Missing at least one digit")).toBeOnTheScreen();
  });

  test("When providing a password without at least one lowercase character, the text 'Missing lowercase character' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign up" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "JHGJHHGJHJBJHJ6")
    await user.press(submitButton);

    expect(screen.getByText("Missing lowercase character")).toBeOnTheScreen();
  });

  test("When providing a password without at least one uppercase character, the text 'Missing uppercase character' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign up" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "efhberhfbrhjbf57")
    await user.press(submitButton);

    expect(screen.getByText("Missing uppercase character")).toBeOnTheScreen();
  });

  test("When providing a password without at least one special character, the text 'Missing special character' should appear", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Sign up" });
    const passwordInput = screen.getByTestId("password-input-field");

    await user.type(passwordInput, "efhberhfHGJHbrhjbf57")
    await user.press(submitButton);

    expect(screen.getByText("Missing special character")).toBeOnTheScreen();
  });
});
