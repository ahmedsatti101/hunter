// GoogleSign.ts
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { router } from "expo-router";

// This is the magic line that tells the popup to message the main window and close
WebBrowser.maybeCompleteAuthSession();

export async function GoogleSignIn() {
  const redirectUri = Platform.OS !== "web" ? "hunter://auth" : "http://localhost:8081/auth";
  const clientId = "2q9djurpg5grc1iogshh2lf36o"; // Cognito Client ID

  const authUrl = `https://hunter.auth.eu-west-2.amazoncognito.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&identity_provider=Google&response_type=code&scope=openid+email+profile&prompt=login`;

  // Wait for the popup to close...
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  // --- NEW WEB FIX ---
  // When the popup closes, the main window gets the result right here!
  if (Platform.OS === "web" && result.type === "success") {
    // Extract the code from the URL that Cognito sent back
    const url = new URL(result.url);
    const code = url.searchParams.get("code");

    if (code) {
      // Manually send the MAIN window to your Auth logic
      router.replace(`/auth?code=${code}`);
    }
  }
}
