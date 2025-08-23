import Index from "~/app/sign-in";
import { render, screen } from "@testing-library/react-native";

describe('SignInMethods screen tests', () => {
  beforeEach(() => {
    render(<Index />);
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

