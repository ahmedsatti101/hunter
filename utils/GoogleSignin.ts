import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export async function GoogleSignIn() {
  const redirectUri = Platform.OS !== "web" ? "hunter://auth" : "http://localhost:8081/auth";
  const clientId = "6qcv0gcs2l3mvjrv5ts3a2kc6t";

  const authUrl = `https://hunter.auth.eu-west-2.amazoncognito.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&identity_provider=Google&response_type=code&scope=openid+email+profile&prompt=select_account`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (Platform.OS === "web" && result.type === "success") {
    const url = new URL(result.url);
    const code = url.searchParams.get("code");

    if (code) {
      router.replace(`/auth?code=${code}`);
    }
  }
}
