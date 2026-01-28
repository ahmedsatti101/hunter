import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text } from "react-native";
import { date, mixed, object, ObjectSchema, string } from "yup";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ThemeContext } from "~/context/ThemeContext";
import { DatePicker, DatePickerHandle } from "@s77rt/react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Textarea } from "~/components/ui/textarea";

enum Status {
  APPLIED = "Applied",
  SUCCESSFUL = "Successful",
  UNSUCCESSFUL = "Unsuccessful",
  INTERVIEW = "Going for interview",
  DECLINED = "Declined offer",
  OFFER = "Role offered",
  NOT_STARTED = "Not started",
  INTERVIEW_SCHEDULED = "Interview scheduled",
  INTERVIEWED = "Interviewed",
  ASSESSMENT = "Complete assessment",
  ASSESSMENT_COMPLETED = "Assessment completed"
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
  foundWhere: string().required("Required").max(100, "Maximum of 100 characters only")
});

export default function AddEntry() {
  const { darkMode } = useContext(ThemeContext);
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
  const mediumFont = "WorkSans-Medium";
  const datePicker = useRef<DatePickerHandle>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStatus, setSelectedStatus] = useState<string>(Status.APPLIED);

  const addEntry = async () => {
    console.log("Entry added");
  };

  return (
    <>
      <SafeAreaView className={`flex-1 ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Stack.Screen options={{ headerTitle: "", headerStyle: { backgroundColor: `${darkMode ? '#1b1b1b' : '#fff'}` }, headerTintColor: darkMode ? '#fff' : '#000', headerShadowVisible: false }} />
        <ScrollView className="px-7">

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Job title<Text className="text-red-500">*</Text>
          </Label>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
                returnKeyType="next"
                autoCapitalize="none"
                style={{ fontFamily: mediumFont }}
                testID="job-title-input"
              />
            )}
            name="title"
          />
          {errors.title && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.title.message}</Text>}

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Job description<Text className="text-red-500">*</Text>
          </Label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
                returnKeyType="next"
                autoCapitalize="none"
                style={{ fontFamily: mediumFont }}
                testID="job-description-input"
              />
            )}
            name="description"
          />
          {errors.description && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.description.message}</Text>}

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Employer<Text className="text-red-500">*</Text>
          </Label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
                returnKeyType="next"
                autoCapitalize="none"
                style={{ fontFamily: mediumFont }}
                testID="employer-input"
              />
            )}
            name="employer"
          />
          {errors.employer && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.employer.message}</Text>}

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Who to contact
          </Label>
          <Controller
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
                returnKeyType="next"
                autoCapitalize="none"
                style={{ fontFamily: mediumFont }}
                testID="contact-input"
              />
            )}
            name="contact"
          />
          {errors.contact && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.contact.message}</Text>}

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Status<Text className="text-red-500">*</Text>
          </Label>
          <Select testID="status-select" onValueChange={(data) => data ? setSelectedStatus(data.value) : Status.APPLIED} required>
            <SelectTrigger className="w-[210px] bg-white p-2 border-[#a7a7a7] rounded-lg">
              <SelectValue placeholder="Select" className="m-1 text-lg" />
            </SelectTrigger>
            <SelectContent className="w-[210px] bg-white">
              <SelectGroup>
                {Object.values(Status).map((s) => {
                  return (
                    <SelectItem key={s} value={s} label={s} className="m-1">
                      <Text
                        className={`${darkMode ? 'text-white' : 'text-black'}`}
                        style={{ fontFamily: mediumFont, fontWeight: "bold" }}>
                        {s}
                      </Text>
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Submission date<Text className="text-red-500">*</Text>
          </Label>
          <Button testID="date-trigger-button" onPress={() => datePicker.current?.showPicker()}
            className={`h-[52px] w-[150px] rounded-lg border items-center justify-center ${darkMode
              ? "bg-[#2a2a2a] border-[#3a3a3a]"
              : "bg-[#f2f2f2] border-[#dcdcdc]"}`}>
            <Text className={`${darkMode ? 'text-white' : 'text-black'}`}>
              {`${selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}`}
            </Text>
          </Button>
          <DatePicker
            ref={datePicker}
            type="date"
            value={selectedDate}
            onChange={setSelectedDate}
            max={new Date()}
            multiple={false}
            options={{ title: "Submission date" }}
          />

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Location
          </Label>
          <Controller
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
                returnKeyType="next"
                autoCapitalize="none"
                style={{ fontFamily: mediumFont }}
                testID="location-input"
              />
            )}
            name="location"
          />
          {errors.location && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.location.message}</Text>}

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Notes
          </Label>
          <Controller
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, value } }) => (
              <Textarea
                value={value}
                onChangeText={onChange}
                className={`h-[110px] p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}
                returnKeyType="next"
                autoCapitalize="none"
                style={{ fontFamily: mediumFont }}
                placeholder="Notes about this job"
                multiline={true}
                testID="notes-input"
              />
            )}
            name="notes"
          />
          {errors.notes && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.notes.message}</Text>}

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Found where<Text className="text-red-500">*</Text>
          </Label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
                returnKeyType="next"
                autoCapitalize="none"
                style={{ fontFamily: mediumFont }}
                testID="found-where-input"
              />
            )}
            name="foundWhere"
          />
          {errors.foundWhere && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.foundWhere.message}</Text>}

          <Label
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg mb-1`}
            style={{ fontFamily: mediumFont }}
          >
            Screenshots of job description
          </Label>

          <Button
            testID="image-picker-button-trigger"
            className={`h-[52px] w-[52px] rounded-lg border items-center justify-center ${darkMode
              ? "bg-[#2a2a2a] border-[#3a3a3a]"
              : "bg-[#f2f2f2] border-[#dcdcdc]"}`} onPress={() => console.log("+ button pressed")}>
            <Text className={`${darkMode ? 'text-white' : 'text-black'} text-2xl`}>+</Text>
          </Button>

          <Button className='justify-end' onPress={handleSubmit(addEntry)}>
            <Text
              className={`${darkMode ? 'bg-white' : 'bg-black'} ${darkMode ? 'text-black' : 'text-white'} p-5 rounded-md text-xl`}
              style={{ fontFamily: mediumFont }}
            >
              Add
            </Text>
          </Button>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}
