import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { Platform, Text } from "react-native";
import { useEffect, useState } from "react";
import Loading from "~/screens/Loading";
import { COGNITO_CLIENT_ID, OAUTH_URL } from "~/lib/constants";

export default function Auth() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [loading, setLoading] = useState<boolean>();

  if (Platform.OS === "web" && typeof window !== "undefined" && window.opener) {
    return <Text>Completing sign in...</Text>;
  }

  useEffect(() => {
    setLoading(true);
    if (!code || !COGNITO_CLIENT_ID) return;

    const redirectUri = Platform.OS !== "web" ? "hunter://auth" : "http://localhost:8081/auth";

    const body = new URLSearchParams();
    body.append("grant_type", 'authorization_code');
    body.append('client_id', COGNITO_CLIENT_ID);
    body.append('code', code);
    body.append('redirect_uri', redirectUri);

    axios.post(`${OAUTH_URL}/oauth2/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then(async (res) => {
        if (res.status === 200) {
          await AsyncStorage.setItem("oauth_refresh_token", res.data.refresh_token);
          await AsyncStorage.setItem("signInTime", Date.now().toString());
          setLoading(false);
          router.replace("/(tabs)/home");
        }
      })
      .catch((err) => console.log(err.response?.data || err, "<<< Token Exchange Error"));
  }, [code]);

  if (loading) return <Loading />;
}
