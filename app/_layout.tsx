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

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { darkMode } = useContext(ThemeContext);
  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack screenOptions={{ headerShadowVisible: false, headerShown: false }} />
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
    if (fontLoaded) {
      AsyncStorage.getItem("email").then((res) => {
        if (res) {
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
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;
