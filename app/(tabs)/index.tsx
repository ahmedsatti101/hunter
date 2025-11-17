import { BackHandler, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeToggle from "~/components/ThemeToggle";
import { useAuth } from "~/context/AuthProvider";

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const validSession = async () => {
      try {
        const [token, signInTimeStr, expiresInStr] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("signInTime"),
          AsyncStorage.getItem("expiresIn")
        ]);

        // If any required item is missing, session is invalid
        if (!token || !signInTimeStr || !expiresInStr) {
          return false;
        }

        const signInTime = new Date(signInTimeStr);
        const expiresIn = parseInt(expiresInStr, 10);

        // Check if date parsing failed
        if (isNaN(signInTime.getTime()) || isNaN(expiresIn)) {
          return false;
        }

        const currentTime = new Date();
        const elapsedTime = (currentTime.getTime() - signInTime.getTime()) / 1000; // Convert to seconds

        return elapsedTime < expiresIn;
      } catch (error) {
        console.error('Error checking session validity:', error);
        return false;
      }
    };

    validSession().then((session) => {
      if (!session) router.navigate("/");
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

  return (
    <>
      <View className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Stack.Screen
          options=
          {{
            headerBackVisible: false,
            headerLeft: undefined,
            title: auth.user?.username ? `Hello, ${auth.user.username}` : "Hunter",
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
