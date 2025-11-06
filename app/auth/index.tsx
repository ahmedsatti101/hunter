import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { Platform, Text } from "react-native";
import { jwtDecode } from "jwt-decode";

export default function Auth() {
  const { code } = useLocalSearchParams<{ code?: string }>();

  const clientId = "";
  const redirectUri = Platform.OS !== "web" ? "hunter://auth" : "http://localhost:8081/auth";

  const body = new URLSearchParams();

  body.append("grant_type", 'authorization_code');
  body.append('client_id', clientId);
  body.append('code', code ?? "");
  body.append('redirect_uri', redirectUri);

  const req = axios.post(`https://hunter.auth.eu-west-2.amazoncognito.com/oauth2/token`, body.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }
  );

  req.then((res) => {
    AsyncStorage.setItem("email", jwtDecode<{ email: string }>(res.data.id_token).email);
    AsyncStorage.setItem("oauth_refresh_token", res.data.refresh_token);
    router.replace("/(tabs)")
  }).catch((err) => console.log(err, "<<< line 17"));

  return <Text>Redirecting...</Text>;
}
