import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useContext, createContext, ReactNode, useState } from "react";
import { Alert, Platform } from "react-native";

interface User {
  // id: string;
  email: string;
  username: string | undefined;
}

interface Session {
  provider_token?: string | null;
  provider_refresh_token?: string | null;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  signin: (data: {
    email: string;
    password: string;
  }) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    username?: string;
  }) => Promise<void>;
  signout: () => Promise<void>;
  validSession: () => Promise<boolean>;
  user: User | undefined;
}

const AuthContext = createContext<Session | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string>("");

  const [user, setUser] = useState<User | undefined>();
  const url = Platform.OS !== "web" ? "https://zwrskymcrd.execute-api.eu-west-2.amazonaws.com" : "http://127.0.0.1:3000";

  const setSession = async (token: string) => {
    setToken(token);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("signInTime", Date.now().toString());
  };

  const validSession = async (): Promise<boolean> => {
    const signInTime = await AsyncStorage.getItem("signInTime");

    if (signInTime) {
      if (new Date().getHours() - new Date(parseInt(signInTime)).getHours() >= 1) {
        await AsyncStorage.multiRemove(["token", "signInTime"]);
        return false;
      }
    } else {
      return false;
    }

    return true;
  }

  const signin = async (data: { email: string, password: string }) => {
    await axios.post(`${url}/signin`,
      data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then((res) => {
      if (res.status === 200) {
        setUser({ email: res.data.email, username: res.data.username });
        setSession(res.data.accessToken);
        Alert.alert("Success", "You have signed in");
        router.navigate("/(tabs)");
        return;
      }
    }).catch((err) => {
      throw err;
    });
  }

  const signup = async (data: { email: string, password: string, username?: string }) => {
    await axios.post(`${url}/signup`,
      data
    ).then((res) => {
      if (res.status === 201) {
        Alert.alert("Success", "Account created. Check your email to verify your account.");
        router.navigate("/sign-in");
      } else {
        console.log(res.status);
        Alert.alert("Info", res.data);
      }
    }).catch((err) => {
      throw err;
    });
  };

  const signout = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      axios.post(`${url}/signout`, {
        token
      }).then(async (res) => {
        if (res.status === 200) {
          setUser(undefined);
          setToken("");
          await AsyncStorage.multiRemove(["token", "signInTime"]);
          router.dismissAll();
        }
      }).catch(async (err) => {
        await AsyncStorage.multiRemove(["token", "signInTime"]);

        if (err.response.data.message === "Access Token has expired") {
          router.navigate("/");
        } else if (err.response.data.message === "Access Token has been revoked") {
          router.navigate("/");
        }
      })
    }
  };

  return <AuthContext.Provider value={{ access_token: token, signin, signout, signup, user, validSession }}>
    {children}
  </AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("User context error");
  }

  return context;
}
