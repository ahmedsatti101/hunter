import { BackHandler, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import ThemeToggle from "~/components/ThemeToggle";
import { useAuth } from "~/context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

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

  const imageUpload = async (url: string, file: Blob, fileType: string | undefined) => {
    console.log(url, file, fileType);

    const req = await axios.put(url, {
      body: file
    }, {
      headers: {
        "Content-Type": fileType,
        "Access-Control-Allow-Origin": "http://localhost:8081"
      }
    });

    console.log(req);
  };

  const imagePicker = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 6,
    }).then(async (data) => {
      if (data.assets) {
        const images: { fileName: string, mimeType: string }[] = [];
        if (data.assets.length > 1) {
          for (const image of data.assets) {
            if (image.fileName && image.mimeType) images.push({ fileName: image.fileName, mimeType: image.mimeType });
            else console.error("Could not retrieve images");
          }
        } else {
          if (data.assets[0].fileName && data.assets[0].mimeType) images.push({ fileName: data.assets[0].fileName, mimeType: data.assets[0].mimeType });
        }

        await axios.post(`http://127.0.0.1:3000/getPresignedUrl`, {
          images,
          userId: user ? user.id : undefined
        }).then(async (res) => {
          if (res.status === 200) {
            const uri = await fetch(data.assets[0].uri);
            const blob = await uri.blob();
            res.data.map((url: any) => {
              imageUpload(url.uploadUrls, blob, data.assets[0].mimeType)
            })
          }
        }).catch(err => console.log(err.message, err.response?.status, err.response?.data)
        )
      }
    })
  };

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
        <Text className="text-white" onPress={imagePicker}>
          Upload images
        </Text>
      </View>
    </>
  );
}
