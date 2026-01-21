import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { date, mixed, object, ObjectSchema, string } from "yup";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { ThemeContext } from "~/context/ThemeContext";

enum Status {
  APPLIED = "Applied",
  SUCCESSFUL = "Successful",
  UNSUCCESSFUL = "Unsuccessful",
  INTERVIEW = "Going for interview",
  DECLINED = "Declined offer",
  OFFER = "Role offered"
};

interface Entry {
  title: string;
  description: string;
  employer: string;
  contact: string | undefined;
  status: Status;
  submissionDate: Date;
  location: string | undefined;
  notes: string | undefined;
  foundWhere: string;
};

const jobEntryFormSchema: ObjectSchema<Entry> = object({
  title: string().required("Job title is required").max(50, "Maximum of 50 characters only"),
  description: string().required("Job description is required").max(350, "Maximum of 350 characters only"),
  employer: string().required("Employer name is required").max(50, "Maximum of 50 characters only"),
  contact: string().max(50, "Maximum of 50 characters only"),
  status: mixed<Status>().oneOf(Object.values(Status)).required("Status is required"),
  submissionDate: date().required("A date is required"),
  location: string().max(100, "Maximum of 100 characters only"),
  notes: string().max(350, "Maximum of 350 characters only"),
  foundWhere: string().required().max(100, "Maximum of 100 characters only")
});

export default function AddEntry() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(jobEntryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      employer: "",
      contact: undefined,
      status: Status.APPLIED,
      submissionDate: new Date(),
      location: undefined,
      notes: undefined,
      foundWhere: ""
    }
  });
  const { darkMode } = useContext(ThemeContext);
  const mediumFont = "WorkSans-Medium";

  return (
    <>
      <View className={`flex-1 ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Stack.Screen options={{ headerTitle: "", headerStyle: { backgroundColor: `${darkMode ? '#1b1b1b' : '#fff'}` }, headerTintColor: darkMode ? '#fff' : '#000', headerShadowVisible: false }} />
        <View>
          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`}
          >
            Job title
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Job description
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Employer
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Who to contact
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Status
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Submission date
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Location
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Notes
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Found where
          </Label>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Screenshots of job description
          </Label>

          <Button className={`${darkMode ? 'bg-white' : 'bg-[#000]'}`}>
            <Text
              className={`${darkMode ? 'text-black' : 'text-white'} p-4 text-lg`}
              style={{ fontFamily: mediumFont }}
            >
              Add
            </Text>
          </Button>
        </View>
      </View>
    </>
  )
}
