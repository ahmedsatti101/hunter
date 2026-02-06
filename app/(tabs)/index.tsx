import { BackHandler, Platform, View } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import ThemeToggle from "~/components/ThemeToggle";
import { useAuth } from "~/context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Button } from "~/components/ui/button";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const router = useRouter();
  const { validSession, user } = useAuth();
  const url = Platform.OS !== "web" ? "https://api-id.execute-api.region.amazonaws.com" : "http://127.0.0.1:3000";

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

  const imageUpload = async (urls: {
    uploadUrls: string,
    key: string
  }[],
    assets: {
      uri: string;
      mimeType: string;
    }[]) => {
    for (let i = 0; i < urls.length; i++) {
      const uri = await fetch(assets[i].uri);
      const blob = await uri.blob();

      await fetch(urls[i].uploadUrls, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': assets[i].mimeType,
        },
      }).then(() => console.log('Upload successful'))
        .catch((err) => console.error("Upload error: ", err));
    };
  };

  const imagePicker = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 6,
    }).then(async (data) => {
      if (data.assets) {
        if (data.assets.length > 6) throw new Error("Maximum of 6 images is allowed");

        const images: { fileName: string, mimeType: string }[] = [];
        for (const image of data.assets) {
          if (image.fileName && image.mimeType) images.push({ fileName: image.fileName, mimeType: image.mimeType });
          else console.error("Could not retrieve images");
        };

        await axios.post(`${url}/getPresignedUrl`, {
          images,
          userId: user ? user.id : undefined
        }).then(async (res) => {
          if (res.status === 200) {
            const assets: { uri: string, mimeType: string }[] = [];
            for (const asset of data.assets) {
              if (asset.mimeType) {
                assets.push({ uri: asset.uri, mimeType: asset.mimeType })
              } else {
                console.warn("MimeType not provided");
              }
            };

            if (assets.length >= 1) imageUpload(res.data, assets);
          }
        }).catch(err => console.log(err, err.message, err.response?.status, err.response?.data)
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
            headerTintColor: darkMode ? "#fff" : "#000",
            headerRight: () => <ThemeToggle />,
            headerShadowVisible: false
          }}
        />
        <Button className={`${darkMode ? 'bg-[#fff]' : 'bg-[#000]'} rounded-full p-5`} onPress={() => router.navigate("/create-entry")}>
          <FontAwesome6 name="plus" size={30} color={`${darkMode ? 'black' : 'white'}`} />
        </Button>
      </View>
    </>
  );
}
