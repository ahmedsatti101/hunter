import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { Platform, Text } from "react-native";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function Auth() {
  const { code } = useLocalSearchParams<{ code?: string }>();

  // --- THE WEB POPUP FIX ---
  // If we are on web, and running inside the popup, stop here!
  // The popup's only job is to securely close itself.
  if (Platform.OS === "web" && typeof window !== "undefined" && window.opener) {
    return <Text>Completing sign in...</Text>;
  }
  // -------------------------

  useEffect(() => {
    if (!code) return; // Wait until we actually have the code

    const clientId = "2q9djurpg5grc1iogshh2lf36o"; // Your Cognito Client ID
    const redirectUri = Platform.OS !== "web" ? "hunter://auth" : "http://localhost:8081/auth";

    const body = new URLSearchParams();
    body.append("grant_type", 'authorization_code');
    body.append('client_id', clientId);
    body.append('code', code);
    body.append('redirect_uri', redirectUri);

    axios.post(`https://hunter.auth.eu-west-2.amazoncognito.com/oauth2/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then((res) => {
        AsyncStorage.setItem("email", jwtDecode<{ email: string }>(res.data.id_token).email);
        AsyncStorage.setItem("oauth_refresh_token", res.data.refresh_token);
        router.replace("/(tabs)");
      })
      .catch((err) => console.log(err.response?.data || err, "<<< Token Exchange Error"));
  }, [code]); // Only run this when the 'code' changes

  return <Text>Redirecting to Home...</Text>;
}
