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
import AuthProvider from "~/context/AuthProvider";
import { PortalHost } from "@rn-primitives/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
    if (fontLoaded) {
      SplashScreen.hide();
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
        <PortalHost />
      </ThemeProvider>
    </AuthProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;
