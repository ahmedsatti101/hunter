import { render, screen, userEvent } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Home from "~/app/(tabs)/index";
import AuthProvider from "~/context/AuthProvider";

jest.mock("expo-router", () => {
  const { View } = require("react-native");

  return {
    Stack: {
      Screen: View
    },
    useRouter: () => ({
      replace: jest.fn(),
      navigate: jest.fn()
    })
  }
});
jest.mock("expo-image-picker", () => {
  const { View } = require("react-native");

  return {
    ImagePicker: View
  }
});
jest.mock("@expo/vector-icons/FontAwesome6", () => {
  const { View } = require("react-native");
  return View;
});

beforeEach(() => {
  render(
    <SafeAreaProvider>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </SafeAreaProvider>
  );
});

describe("Home page tests", () => {
  test("Job entry card component should be visible on the screen", () => {
    const card = screen.getByTestId("job-entry-card");

    expect(card).toBeOnTheScreen();
    expect(card).toBeVisible();
  });
  test("Card component header should be visible on the screen", () => {
    const header = screen.getByTestId("card-header");

    expect(header).toBeOnTheScreen();
    expect(header).toBeVisible();
  });
  test("Card component footer should be visible on the screen", () => {
    const footer = screen.getByTestId("card-footer");

    expect(footer).toBeOnTheScreen();
    expect(footer).toBeVisible();
  });
  test("A button to delete a job entry should be visible on the screen", () => {
    const button = screen.getByTestId("delete-job-button");

    expect(button).toBeOnTheScreen();
    expect(button).not.toBeDisabled();
  });
  test("A button to edit a job entry should be visible on the screen", () => {
    const button = screen.getByRole("button", { name: "Edit" });

    expect(button).toBeOnTheScreen();
    expect(button).not.toBeDisabled();
  });
  test("modal test", async () => {
    const button = screen.getByTestId("delete-job-button");
    const user = userEvent.setup();

    await user.press(button);
  })
});
