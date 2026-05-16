import { render, screen } from "@testing-library/react-native"
import Account from "~/app/(tabs)/account";
import AuthProvider from "~/context/AuthProvider";

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
  render(
    <AuthProvider>
      <Account />
    </AuthProvider>
  );
});

describe("Account page tests", () => {
  test("Log out button should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Sign out" });

    expect(button).toBeOnTheScreen();
    expect(button).not.toBeDisabled();
  });
});
