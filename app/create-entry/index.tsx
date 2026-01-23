import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { date, mixed, object, ObjectSchema, string } from "yup";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ThemeContext } from "~/context/ThemeContext";
import { DatePicker, DatePickerHandle } from "@s77rt/react-native-date-picker";

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
  foundWhere: string().required("Required field").max(100, "Maximum of 100 characters only")
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
  const datePicker = useRef<DatePickerHandle>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  console.log(selectedDate?.toLocaleDateString());

  const addEntry = async () => {
    console.log("Entry added");
  };

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
              />
            )}
            name="title"
          />
          {errors.title && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.title.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Job description
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
              />
            )}
            name="description"
          />
          {errors.description && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.description.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Employer
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
              />
            )}
            name="employer"
          />
          {errors.employer && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.employer.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
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
              />
            )}
            name="contact"
          />
          {errors.contact && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.contact.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Status
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue className={`${darkMode ? 'text-white' : 'text-black'}`} placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(Status).map((s) => {
                  return (
                    <SelectItem key={s} value={s} label={s}>
                      <Text className={`${darkMode ? 'text-white' : 'text-black'}`}>{s}</Text>
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Submission date
          </Label>
          <Button onPress={() => datePicker.current?.showPicker()}>
            <Text>Select date</Text>
          </Button>
          <DatePicker
            ref={datePicker}
            type="date"
            value={selectedDate}
            onChange={setSelectedDate}
            min={new Date()}
            // max={}
            multiple={false}
          // styles={{ containerColor: `${darkMode ? '#1b1b1b' : '#fff'}`, selectedDayContainerColor: '#fff' }}
          />

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
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
              />
            )}
            name="location"
          />
          {errors.location && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.location.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Notes
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
              />
            )}
            name="notes"
          />
          {errors.notes && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.notes.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Found where
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
              />
            )}
            name="foundWhere"
          />
          {errors.foundWhere && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.foundWhere.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          >
            Screenshots of job description
          </Label>

          <Button className={`${darkMode ? 'bg-white' : 'bg-[#000]'}`} onPress={handleSubmit(addEntry)}>
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
