import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { render, screen } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

jest.mock("expo-router", () => {
  const { View } = require("react-native");

  return {
    Stack: {
      Screen: View
    },
    useRouter: () => ({
      replace: jest.fn(),
      navigate: jest.fn()
    }),
    useFocusEffect: () => { }
  }
});
jest.mock("@expo/vector-icons/FontAwesome6", () => {
  const { View } = require("react-native");
  return View;
});

beforeEach(() => {
  render(
    <Card
      testID="job-entry-card"
    >
      <CardHeader className="flex-row m-3" testID="card-header">
        <View className="gap-0.5">
          <CardTitle
            style={{ fontFamily: "WorkSans-Bold" }}
          >
            Job title
          </CardTitle>
          <CardDescription
            style={{ fontFamily: "WorkSans-Medium", color: "#707070" }}
          >
            Company XYZ
          </CardDescription>
          <CardDescription
            style={{ fontFamily: "WorkSans-Medium" }}
          >
            Status: Unsuccessful
          </CardDescription>
        </View>
      </CardHeader>
      <CardFooter className="justify-between m-2 mt-5" testID="card-footer">
        <Button testID="delete-job-button">
          <FontAwesome6 name="trash" size={30} />
        </Button>
        <Button>
          <Text
            style={{ fontFamily: "WorkSans-Medium" }}>
            Edit
          </Text>
        </Button>
      </CardFooter>
    </Card>
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
});
