import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export async function GoogleSignIn() {
  const redirectUri = Platform.OS !== "web" ? "hunter://home" : "http://localhost:8081/home";
  await WebBrowser.openBrowserAsync(`https://hunter.auth.eu-west-2.amazoncognito.com/oauth2/authorize?client_id=&redirect_uri=${redirectUri}&identity_provider=Google&response_type=code&scope=openid+email+profile`)
}
