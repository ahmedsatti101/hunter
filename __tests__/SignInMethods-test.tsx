import SignInMethods from "~/app/index";
import { render, screen } from "@testing-library/react-native";

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    AntDesign: View,
    Feather: View,
    FontAwesome5: View
  }
});

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    },
    useRouter: () => { }
  }
});

describe('SignInMethods screen tests', () => {
  beforeEach(() => {
    render(<SignInMethods />);
  });

  test("The text 'Choose your sign in method' should be visible on the screen", () => {
    const text = screen.getByText("Choose your sign in method");

    expect(text).toBeVisible();
    expect(text).toBeOnTheScreen();
  })

  test("The text 'Don't have an account? Click here' should be visible on the screen", () => {
    const text = screen.getByText("Don't have an account? Click here");

    expect(text).toBeVisible();
    expect(text).toBeOnTheScreen();
  })

  test("Button with text 'Sign in with email' should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Sign in with email", disabled: false });

    expect(button).toBeVisible();
    expect(button).toBeOnTheScreen();
  })

  test("Button with text 'Sign in with Google' should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Sign in with Google", disabled: false });

    expect(button).toBeVisible();
    expect(button).toBeOnTheScreen();
  })

  test("Button with text 'Sign in with Facebook' should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Sign in with Facebook", disabled: false });

    expect(button).toBeVisible();
    expect(button).toBeOnTheScreen();
  })
})

