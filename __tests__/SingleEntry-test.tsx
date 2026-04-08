import { render, screen } from "@testing-library/react-native";
import EntryScreen from "~/app/entry/[id]";

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Feather: View,
  }
});

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    },
    useRouter: () => { },
    useLocalSearchParams: (): { id: string } => { return { id: "" } }
  }
});

jest.mock("expo-image", () => {
  const { View } = require("react-native");
  return {
    Image: View
  }
});

jest.mock("@likashefqet/react-native-image-zoom", () => {
  const { View } = require("react-native");
  return {
    Zoomable: View
  }
});

describe("EntryScreen tests", () => {
  beforeEach(() => {
    render(
      <EntryScreen />
    );
  });

  test("The job title for an entry should be on the screen", () => {
    const title = screen.getByTestId("job-title");

    expect(title).toBeOnTheScreen();
  });
  test("Icon button to edit entry should be on the screen and clickable", () => {
    const editButton = screen.getByTestId("edit-button");

    expect(editButton).toBeOnTheScreen();
  });
  test('renders all section headers correctly', () => {
    const { getByText } = screen;

    expect(getByText('Job description')).toBeTruthy();
    expect(getByText('Notes')).toBeTruthy();
    expect(getByText('Contact')).toBeTruthy();
    expect(getByText('Found where')).toBeTruthy();
    expect(getByText('Screenshots')).toBeTruthy();
  });

  describe("Entry metadata", () => {
    test("Employer name should be visible on the screen", () => {
      const employer = screen.getByTestId("employer");

      expect(employer).toBeOnTheScreen();
    });
    test("Location of job entry should be visible on the screen", () => {
      const location = screen.getByTestId("location");

      expect(location).toBeOnTheScreen();
    });
    test("Status of the job entry should be visible on the screen", () => {
      const status = screen.getByTestId("status");

      expect(status).toBeOnTheScreen();
    });
    test("Submission date of the job entry should be visible on the screen", () => {
      const date = screen.getByTestId("date-submitted");

      expect(date).toBeOnTheScreen();
    });
    test("Last update date of the job entry should be visible on the screen", () => {
      const lastUpdated = screen.getByTestId("last-update");

      expect(lastUpdated).toBeOnTheScreen();
    });
  });
});
