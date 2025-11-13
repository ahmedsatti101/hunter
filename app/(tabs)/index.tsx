import { BackHandler, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeToggle from "~/components/ThemeToggle";
import { useAuth } from "~/context/AuthProvider";

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const router = useRouter();
  const [token, setToken] = useState<string | null>();
  const auth = useAuth();

  useEffect(() => {
    AsyncStorage.getItem("token").then((res) => {
      if (!res) {
        router.navigate("/");
      }
      setToken(res);
    });

    const backAction = () => {
      BackHandler.exitApp();
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [token]);

  return (
    <>
      <View className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Stack.Screen
          options=
          {{
            headerBackVisible: false,
            headerLeft: undefined,
            title: auth.username ? `Hello, ${auth.username}` : "Hunter",
            headerTitleStyle: { fontFamily: "WorkSans-Bold" },
            headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
            headerTintColor: darkMode ? "#fff" : "#000", headerRight: () => <ThemeToggle />,
            headerShadowVisible: false
          }}
        />
        <Text className="text-red-800">
          Edit app/(tabs)/index.tsx to edit this screen
        </Text>
      </View>
    </>
  );
}
