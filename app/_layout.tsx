import "~/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Loading from "~/screens/Loading";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ThemeToggle from "~/components/ThemeToggle";
import { useFonts } from "expo-font";
import ThemeProvider from "~/context/ThemeContext";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { darkMode } = useContext(ThemeContext);
  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerTitle: "Hello, H.",
          headerTitleStyle: { fontFamily: "WorkSans-Bold" },
          headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
          headerShadowVisible: false,
          headerTintColor: darkMode ? "#fff" : "#000",
          headerRight: () => <ThemeToggle />,
        }}
      />
    </>
  );
};

export default function RootLayout() {
  const hasMounted = useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [fontLoaded] = useFonts({
    'WorkSans-Medium': require("../assets/fonts/WorkSans-Medium.ttf"),
    'WorkSans-Bold': require("../assets/fonts/WorkSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontLoaded) {
      setAppReady(true);
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

  if (!appReady) {
    return <Loading />;
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
