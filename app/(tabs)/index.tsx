import { BackHandler, Platform, View, Text, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import ThemeToggle from "~/components/ThemeToggle";
import { useAuth } from "~/context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Button } from "~/components/ui/button";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertModal from "~/components/AlertModal";

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const router = useRouter();
  const { validSession, user } = useAuth();
  const url = Platform.OS !== "web" ? "https://api-id.execute-api.region.amazonaws.com" : "http://127.0.0.1:3000";
  const [alertModal, setAlertModal] = useState<boolean>(false);

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
      <SafeAreaView className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
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
        <ScrollView>
          <Card
            className={`flex rounded-lg ${darkMode ? 'bg-[#000]' : 'bg-white'} border-black m-4`}
            testID="job-entry-card"
          >
            <CardHeader className="flex-row m-3" testID="card-header">
              <View className="gap-0.5">
                <CardTitle
                  style={{ fontFamily: "WorkSans-Bold" }}
                  className={`text-2xl ${darkMode ? 'text-white' : 'text-black'}`}
                >
                  Job title
                </CardTitle>
                <CardDescription
                  style={{ fontFamily: "WorkSans-Medium", color: "#707070" }}
                  className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}
                >
                  Company XYZ
                </CardDescription>
                <CardDescription
                  style={{ fontFamily: "WorkSans-Medium" }}
                  className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}
                >
                  Status: Unsuccessful
                </CardDescription>
              </View>
            </CardHeader>
            <CardFooter className="justify-between m-2 mt-5" testID="card-footer">
              <Button onPress={() => setAlertModal(true)} testID="delete-job-button">
                <FontAwesome6 name="trash" size={30} color={`${darkMode ? 'white' : 'black'}`} />
              </Button>
              <Button className={`${darkMode ? 'bg-white' : 'bg-black'}`}>
                <Text
                  style={{ fontFamily: "WorkSans-Medium" }}
                  className={`${darkMode ? 'text-black' : 'text-white'} text-lg p-1.5`}>
                  Edit
                </Text>
              </Button>
            </CardFooter>
          </Card>

          <Button className={`${darkMode ? 'bg-[#fff]' : 'bg-[#000]'} rounded-full p-5`} onPress={() => router.navigate("/create-entry")}>
            <FontAwesome6 name="plus" size={30} color={`${darkMode ? 'black' : 'white'}`} />
          </Button>
        </ScrollView>
        <AlertModal open={alertModal} close={() => setAlertModal(false)} />
      </SafeAreaView>
    </>
  );
}
