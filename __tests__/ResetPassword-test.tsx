import { render, screen } from "@testing-library/react-native";
import ResetPassword from "~/app/reset-password";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    },
    useLocalSearchParams: () => {
      return { email: "" }
    },
    useRouter: () => { }
  }
});

describe("<ResetPassword /> tests", () => {
  beforeEach(() => {
    render(<ResetPassword />);
  });

  test("The text 'Enter the code sent to your email and set a new password' should be on the screen", () => {
    const text = screen.getByText("Enter the code sent to your email and set a new password");

    expect(text).toBeOnTheScreen();
    expect(text).toBeVisible();
  });

  test("Form submit button should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Reset password", disabled: false });

    expect(button).toBeOnTheScreen();
    expect(button).toBeVisible();
  });

  test("Verification code field label should be on the screen", () => {
    const label = screen.getByTestId("verification-code-label");

    expect(label).toBeOnTheScreen();
    expect(label).toBeVisible();
  });

  test("Verification code input field should be on the screen", () => {
    const input = screen.getByTestId("verification-code-input-field");

    expect(input).toBeOnTheScreen();
    expect(input).toBeVisible();
  });

  test("New password field label should be on the screen", () => {
    const label = screen.getByTestId("new-password-label");

    expect(label).toBeOnTheScreen();
    expect(label).toBeVisible();
  });

  test("New password input field should be on the screen", () => {
    const input = screen.getByTestId("new-password-input-field");

    expect(input).toBeOnTheScreen();
    expect(input).toBeVisible();
  });
});
