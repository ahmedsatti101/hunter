import { render, screen } from "@testing-library/react-native";
import AddEntry from "~/app/create-entry";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Stack: {
      Screen: View
    }
  }
});

describe("<AddEntry /> tests", () => {
  beforeEach(() => {
    render(
      <AddEntry />
    )
  });

  describe("Form labels", () => {
    test("Should display 'Job title' field label", () => {
      const jobTitleLabel = screen.getByRole("text", { name: "Job title*" });

      expect(jobTitleLabel).toBeVisible();
      expect(jobTitleLabel).toBeOnTheScreen();
    });

    test("Should display 'Job description' field label", () => {
      const jobDescLabel = screen.getByRole("text", { name: "Job description*" });

      expect(jobDescLabel).toBeVisible();
      expect(jobDescLabel).toBeOnTheScreen();
    });

    test("Should display 'Employer' field label", () => {
      const employerLabel = screen.getByRole("text", { name: "Employer*" });

      expect(employerLabel).toBeVisible();
      expect(employerLabel).toBeOnTheScreen();
    });

    test("Should display 'Who to contact' field label", () => {
      const label = screen.getByRole("text", { name: "Who to contact" });

      expect(label).toBeVisible();
      expect(label).toBeOnTheScreen();
    });

    test("Should display 'Status' field label", () => {
      const statusLabel = screen.getByRole("text", { name: "Status*" });

      expect(statusLabel).toBeVisible();
      expect(statusLabel).toBeOnTheScreen();
    });

    test("Should display 'Submission date' field label", () => {
      const dateLabel = screen.getByRole("text", { name: "Submission date*" });

      expect(dateLabel).toBeVisible();
      expect(dateLabel).toBeOnTheScreen();
    });

    test("Should display 'Location' field label", () => {
      const locationLabel = screen.getByRole("text", { name: "Location" });

      expect(locationLabel).toBeVisible();
      expect(locationLabel).toBeOnTheScreen();
    });

    test("Should display 'Notes' field label", () => {
      const notesLabel = screen.getByRole("text", { name: "Notes" });

      expect(notesLabel).toBeVisible();
      expect(notesLabel).toBeOnTheScreen();
    });

    test("Should display 'Found where' field label", () => {
      const label = screen.getByRole("text", { name: "Found where*" });

      expect(label).toBeVisible();
      expect(label).toBeOnTheScreen();
    });

    test("Should display 'Screenshots of job description' field label", () => {
      const label = screen.getByRole("text", { name: "Screenshots of job description" });

      expect(label).toBeVisible();
      expect(label).toBeOnTheScreen();
    });
  });

  describe("Form inputs", () => {
    test("Should display 'Job title' field", () => {
      const jobTitleLabel = screen.getByTestId("job-title-input");

      expect(jobTitleLabel).toBeVisible();
      expect(jobTitleLabel).toBeOnTheScreen();
    });

    test("Should display 'Job description' field", () => {
      const jobDescLabel = screen.getByTestId("job-description-input");

      expect(jobDescLabel).toBeVisible();
      expect(jobDescLabel).toBeOnTheScreen();
    });

    test("Should display 'Employer' field", () => {
      const employerLabel = screen.getByTestId("employer-input");

      expect(employerLabel).toBeVisible();
      expect(employerLabel).toBeOnTheScreen();
    });

    test("Should display 'Who to contact' field", () => {
      const label = screen.getByTestId("contact-input");

      expect(label).toBeVisible();
      expect(label).toBeOnTheScreen();
    });

    test("Should display 'Status' field", () => {
      const statusLabel = screen.getByTestId("status-select");

      expect(statusLabel).toBeVisible();
      expect(statusLabel).toBeOnTheScreen();
    });

    test("Should display 'Location' field", () => {
      const locationLabel = screen.getByTestId("location-input");

      expect(locationLabel).toBeVisible();
      expect(locationLabel).toBeOnTheScreen();
    });

    test("Should display 'Notes' field", () => {
      const notesLabel = screen.getByTestId("notes-input");

      expect(notesLabel).toBeVisible();
      expect(notesLabel).toBeOnTheScreen();
    });

    test("Should display 'Found where' field", () => {
      const label = screen.getByTestId("found-where-input");

      expect(label).toBeVisible();
      expect(label).toBeOnTheScreen();
    });
  });

  describe("Form buttons", () => {
    test("The button to show the date picker should be on the screen", () => {
      const button = screen.getByTestId("date-trigger-button");

      expect(button).toBeVisible();
      expect(button).toBeOnTheScreen();
    });

    test("The button to add screenshots to an entry should be on the screen", () => {
      const button = screen.getByTestId("image-picker-button-trigger");

      expect(button).toBeVisible();
      expect(button).toBeOnTheScreen();
    });

    test("Form submit button should be on the screen", () => {
      const button = screen.getByRole("button", { name: "Add" });

      expect(button).toBeVisible();
      expect(button).toBeOnTheScreen();
    });
  });
});
