import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export async function GoogleSignIn() {
  const redirectUri = Platform.OS !== "web" ? "hunter://auth" : "http://localhost:8081/auth";
  const isMobile = Platform.OS !== "web" ? "hunter://" : "http://localhost:8081";

  await WebBrowser.openAuthSessionAsync(`https://hunter.auth.eu-west-2.amazoncognito.com/oauth2/authorize?client_id=6ko4n5m9j2rf5ka27cpll9112e&redirect_uri=${redirectUri}&identity_provider=Google&response_type=code&scope=openid+email+profile&prompt=select_account%20consent`, isMobile);
}
