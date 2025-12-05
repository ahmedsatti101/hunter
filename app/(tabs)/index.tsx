import { BackHandler, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import ThemeToggle from "~/components/ThemeToggle";
import { useAuth } from "~/context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const router = useRouter();
  const { validSession, user } = useAuth();

  useEffect(() => {
    AsyncStorage.getItem("token").then((res) => {
      if (!res) {
        router.replace("/");
      } else {
        validSession().then((valid) => {
          if (!valid) router.replace("/");
        });
      }
    })

    const backAction = () => {
      BackHandler.exitApp();
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const imageUpload = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 6
    }).then(async (data) => {
      if (data.assets) {
        await axios.post("/uploadImage", {
          mimeType: data.assets[0].mimeType,
          imageName: data.assets[0].fileName,
          uri: data.assets[0].uri
        }).catch(err => console.log('axios error', err.message, err.response?.status, err.response?.data)
        )
      }
    })
  }
  return (
    <>
      <View className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Stack.Screen
          options=
          {{
            headerBackVisible: false,
            headerLeft: undefined,
            title: user?.username ? `Hello, ${user.username}` : "Hunter",
            headerTitleStyle: { fontFamily: "WorkSans-Bold" },
            headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
            headerTintColor: darkMode ? "#fff" : "#000", headerRight: () => <ThemeToggle />,
            headerShadowVisible: false
          }}
        />
        <Text className="text-red-800" onPress={imageUpload}>
          Edit app/(tabs)/index.tsx to edit this screen
        </Text>
      </View>
    </>
  );
}
