import { useLocalSearchParams } from "expo-router";
import { Platform, Text } from "react-native";
import { useEffect, useState } from "react";
import Loading from "~/screens/Loading";
import { COGNITO_CLIENT_ID } from "~/lib/constants";
import { useAuth } from "~/context/AuthProvider";

export default function Auth() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [loading, setLoading] = useState<boolean>();
  const { socialSignIn } = useAuth();

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

    socialSignIn(body).catch(() => setLoading(false));
  }, [code]);

  if (loading) return <Loading />;
}
