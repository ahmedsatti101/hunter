import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { router } from "expo-router";
import { COGNITO_CLIENT_ID, OAUTH_URL } from "~/lib/constants";

WebBrowser.maybeCompleteAuthSession();

export async function FacebookSignIn() {
  const redirectUri = Platform.OS !== "web" ? "hunter://auth" : "http://localhost:8081/auth";

  const authUrl = `${OAUTH_URL}/oauth2/authorize?client_id=${COGNITO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&identity_provider=Facebook&response_type=code&scope=email`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (Platform.OS === "web" && result.type === "success") {
    const url = new URL(result.url);
    const code = url.searchParams.get("code");

    if (code) {
      router.replace(`/auth?code=${code}`);
    }
  }
}
