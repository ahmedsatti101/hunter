import { yupResolver } from "@hookform/resolvers/yup";
import { router, Stack, useLocalSearchParams } from "expo-router";
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
import axios from "axios";
import { API_URL } from "~/lib/constants";
import ModalComponent from "~/components/Modal";

enum Status {
  APPLIED = "Applied",
  SUCCESSFUL = "Successful",
  UNSUCCESSFUL = "Unsuccessful",
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
  contact?: string;
  status: Status;
  submissionDate: Date;
  location?: string;
  notes?: string;
  foundWhere: string;
};

const updateEntryFormSchema: ObjectSchema<Entry> = object({
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

export default function UpdateEntry() {
  const {
    id, title, description, employer, contact, status, submissionDate, location, notes, foundWhere
  } = useLocalSearchParams<{
    id: string,
    title: string,
    description: string,
    employer: string,
    contact?: string,
    status: any,
    submissionDate: any,
    location?: string,
    notes?: string,
    foundWhere: string
  }>();
  const { darkMode } = useContext(ThemeContext);
  const { control, handleSubmit, formState: { errors } } = useForm<Entry>({
    resolver: yupResolver(updateEntryFormSchema),
    defaultValues: {
      title,
      description,
      employer,
      contact,
      status,
      submissionDate,
      location,
      notes,
      foundWhere
    }
  });
  const mediumFont = "WorkSans-Medium";
  const datePicker = useRef<DatePickerHandle>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStatus, setSelectedStatus] = useState<string>(status);
  const descriptionInputRef = useRef(null);
  const employerInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const notesInputRef = useRef(null);
  const foundWhereInputRef = useRef(null);
  const [updateState, setUpdateState] = useState<boolean>();
  const [modal, setModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalBody, setModalBody] = useState<string>("");

  const formatDateForDb = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  const updateEntry = (data: Entry) => {
    setUpdateState(true);
    const dateToSend = selectedDate ? selectedDate : new Date(data.submissionDate);

    axios.patch(`${API_URL}/updateEntry`, {
      id,
      title: data.title,
      description: data.description,
      employer: data.employer,
      contact: data.contact,
      status: selectedStatus,
      submissionDate: formatDateForDb(dateToSend),
      location: data.location,
      foundWhere: data.foundWhere,
      notes: data.notes,
    }).then(res => {
      if (res.status === 204) {
        setUpdateState(false);
        setModal(true);
        setModalTitle("Success");
        setModalBody("Successfully updated job");
        router.dismissTo("/home");
      }
    }).catch(err => {
      setUpdateState(false);
      setModal(true);
      setModalTitle("Error");
      setModalBody("Could not update job. Try again later")
      // console.log(err.response);
    })
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
                onSubmitEditing={() => descriptionInputRef.current.focus()}
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
                ref={descriptionInputRef}
                onSubmitEditing={() => employerInputRef.current.focus()}
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
                ref={employerInputRef}
                onSubmitEditing={() => contactInputRef.current.focus()}
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
                ref={contactInputRef}
                onSubmitEditing={() => locationInputRef.current.focus()}
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
                ref={locationInputRef}
                onSubmitEditing={() => notesInputRef.current.focus()}
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
                ref={notesInputRef}
                onSubmitEditing={() => foundWhereInputRef.current.focus()}
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
                ref={foundWhereInputRef}
              />
            )}
            name="foundWhere"
          />
          {errors.foundWhere && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.foundWhere.message}</Text>}

          <Button className='justify-end' onPress={handleSubmit(updateEntry)} disabled={updateState}>
            <Text
              className={`${darkMode ? 'bg-white' : 'bg-black'} ${darkMode ? 'text-black' : 'text-white'} ${updateState ? 'bg-gray-600' : ''} p-5 rounded-md text-xl`}
              style={{ fontFamily: mediumFont }}
            >
              Update
            </Text>
          </Button>
        </ScrollView>
        <ModalComponent open={modal} close={() => setModal(false)} title={modalTitle} body={modalBody} />
      </SafeAreaView>
    </>
  )
}
