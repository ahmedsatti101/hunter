import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { ThemeContext } from "~/context/ThemeContext";
import { useImage } from "~/context/ImageProvider";
import axios from "axios";
import { API_URL } from "~/lib/constants";

export default function EntryScreen() {
  const entryId = useLocalSearchParams<{ id: string }>();
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";
  const { darkMode } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const { showImage } = useImage();
  const [entry, setEntry] = useState<any>({});
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const entrySubmissionDate = new Date(entry.submission_date);
  const lastUpdated = new Date(entry.last_updated);

  useEffect(() => {
    axios.get(`${API_URL}/entry/${entryId.id}`)
      .then((res) => {
        if (res.status === 200) {
          setEntry(res.data.entry);
          setScreenshots(res.data.screenshots);
        }
      }).catch(e => console.log(e));
  }, [entryId.id]);

  return (
    <>
      <ScrollView
        className={`flex-1 ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}
        contentContainerStyle={{
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
        }}>
        <Stack.Screen
          options=
          {{
            headerBackVisible: true,
            headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
            headerTintColor: darkMode ? "#fff" : "#000",
            headerShadowVisible: false,
            headerTitle: ""
          }}
        />
        <View className="m-4 mb-0 flex-row justify-between items-center">
          <Text testID="job-title" style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-2xl`}>
            {entry.title}
          </Text>
          <TouchableOpacity testID="edit-button">
            <Feather name="edit" size={22} color={`${darkMode ? 'white' : 'black'}`} />
          </TouchableOpacity>
        </View>

        <View testID="entry-metadata" className="m-4 mb-0 flex-col gap-y-1">
          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}
            testID="employer">
            Employer: {entry.employer}
          </Text>

          <View className="flex-row items-center">
            <Feather name="map-pin" size={14} color={`${darkMode ? '#a9a9a9' : '#666666'}`} />
            <Text
              style={{ fontFamily: mediumFont }}
              className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium ml-1`}
              testID="location">
              {entry.location === null ? "No location provided" : entry.location}
            </Text>
          </View>

          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}
            testID="status">
            Status: {entry.status}
          </Text>

          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}
            testID="date-submitted">
            Submission date: {
              (entrySubmissionDate.getDate() < 10 ? "0" + entrySubmissionDate.getDate() : entrySubmissionDate.getDate())
              + "/" + (entrySubmissionDate.getMonth() + 1) +
              "/" + entrySubmissionDate.getFullYear()
            }
          </Text>

          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}
            testID="last-update">
            Last update: {
              (lastUpdated.getDate() < 10 ? "0" + lastUpdated.getDate() : lastUpdated.getDate())
              + "/" + (lastUpdated.getMonth() + 1) +
              "/" + lastUpdated.getFullYear()
            }
          </Text>
        </View>

        <View className="m-4">
          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Job description
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            {entry.description}
          </Text>

          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Notes
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            {entry.notes === null ? "No notes provided" : entry.notes}
          </Text>

          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Contact
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            {entry.contact === null ? "No contact provided" : entry.contact}
          </Text>

          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Found where
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            {entry.found_where}
          </Text>

          <View>
            <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
              Screenshots
            </Text>

            <View className="mt-1 flex-row flex-wrap">
              {screenshots.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="w-[31%] aspect-square bg-gray-200 rounded-xl overflow-hidden mb-2 mr-[2%]"
                  activeOpacity={0.7}
                  onPress={() => showImage(item)}
                >
                  <Image
                    source={{ uri: item }}
                    className="w-full h-full"
                    alt=""
                  />
                </TouchableOpacity>
              ))}

              {screenshots.length === 0 && (
                <Text className={`${darkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: mediumFont }}>No screenshots uploaded.</Text>
              )}
            </View>
          </View>

        </View>
        <Button className="mr-3 flex items-center justify-end gap-x-6">
          <Text style={{ fontFamily: mediumFont }} className="bg-red-500 rounded-md p-3 text-lg text-white">
            Delete
          </Text>
        </Button>
      </ScrollView>
    </>
  )
}
