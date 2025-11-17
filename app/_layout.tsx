import "~/global.css";

import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useFonts } from "expo-font";
import ThemeProvider from "~/context/ThemeContext";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";
export { ErrorBoundary } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthProvider from "~/context/AuthProvider";

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { darkMode } = useContext(ThemeContext);
  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  const hasMounted = useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [fontLoaded] = useFonts({
    'WorkSans-Medium': require("../assets/fonts/WorkSans-Medium.ttf"),
    'WorkSans-Bold': require("../assets/fonts/WorkSans-Bold.ttf"),
  });

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

    if (fontLoaded) {
      validSession().then((session) => {
        if (session) {
          SplashScreen.hide();
          router.navigate("/(tabs)")
        } else {
          SplashScreen.hide();
          router.navigate("/")
        }
      })
    }
  }, [fontLoaded]);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </AuthProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;
