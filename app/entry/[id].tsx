import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { ThemeContext } from "~/context/ThemeContext";
import { useImage } from "~/context/ImageProvider";

export default function EntryScreen() {
  const entryId = useLocalSearchParams<{ id: string }>();
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";
  const { darkMode } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const screenshots = [
    { id: '1', url: 'https://reactnative.dev/img/tiny_logo.png' },
    { id: '2', url: 'https://fastly.picsum.photos/id/109/200/200.jpg?hmac=vqAWt9QCvOo67gp7N7_-QeMlU5k0G47VIWM_B8Js-ww' },
  ];
  const { showImage } = useImage();

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
          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-2xl`}>
            Junior Software Engineer
          </Text>
          <TouchableOpacity>
            <Feather name="edit" size={22} color={`${darkMode ? 'white' : 'black'}`} />
          </TouchableOpacity>
        </View>

        <View className="m-4 mb-0 flex-col gap-y-1">
          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}>
            Employer: Apple
          </Text>

          <View className="flex-row items-center">
            <Feather name="map-pin" size={14} color={`${darkMode ? '#a9a9a9' : '#666666'}`} />
            <Text
              style={{ fontFamily: mediumFont }}
              className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium ml-1`}>
              Bristol, UK
            </Text>
          </View>

          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}>
            Status: Unsuccessful
          </Text>

          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}>
            Submission date: 20/04/24
          </Text>

          <Text
            style={{ fontFamily: mediumFont }}
            className={`text-lg ${darkMode ? 'text-[#a9a9a9]' : 'text-[#666666]'} text-base font-medium`}>
            Last update: 01/01/26
          </Text>
        </View>

        <View className="m-4">
          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Description
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sodales, tortor sed accumsan facilisis, lectus velit scelerisque elit, id pellentesque velit mauris molestie purus. Curabitur euismod elit id nibh ornare dapibus. Proin quis nibh id magna mollis bibendum. In pellentesque arcu eu purus interdum, sed suscipit lorem venenatis. Proin sollicitudin finibus tortor eget suscipit. Fusce metus eros, viverra quis ante eget, facilisis vestibulum lorem. Pellentesque semper nec neque quis tempor. Nam vel metus est. Nullam vel placerat eros. Praesent egestas lacus in interdum euismod. Phasellus vel consequat odio. Nullam eget diam eleifend, elementum tortor eget, ullamcorper lorem. Proin tincidunt libero vel convallis consequat.
          </Text>

          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Notes
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sodales, tortor sed accumsan facilisis, lectus velit scelerisque elit, id pellentesque velit mauris molestie purus. Curabitur euismod elit id nibh ornare dapibus. Proin quis nibh id magna mollis.
          </Text>

          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Contact
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            mia.rodriguez@dummyjson.com
          </Text>

          <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
            Found where
          </Text>
          <Text
            style={{ fontFamily: mediumFont }}
            className={`${darkMode ? 'text-white' : 'text-black'} text-lg mt-1 mb-3`}>
            LinkedIn
          </Text>

          <View>
            <Text style={{ fontFamily: boldFont }} className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}>
              Screenshots
            </Text>

            <View className="mt-1 flex-row flex-wrap">
              {screenshots.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="w-[31%] aspect-square bg-gray-200 rounded-xl overflow-hidden mb-2 mr-[2%]"
                  activeOpacity={0.7}
                  onPress={() => showImage(item.url)}
                >
                  <Image
                    source={{ uri: item.url }}
                    className="w-full h-full"
                    alt=""
                  />
                </TouchableOpacity>
              ))}
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
