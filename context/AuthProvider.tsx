import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useContext, createContext, ReactNode, useState } from "react";
import { Alert, Platform } from "react-native";

interface UserContextType {
  email: string;
  token: string;
  username: string | undefined;
  signin: (data: {
    email: string;
    password: string;
  }) => void;
  signup: (data: {
    email: string;
    password: string;
    username: string | undefined;
  }) => void;
  signout: () => Promise<void>;
  platform: Platform["OS"];
}

const AuthContext = createContext<UserContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const saveToken = async (token: string) => {
    setToken(token);
    await AsyncStorage.setItem("token", token);
  };
  const [username, setUsername] = useState<string | undefined>();
  const platform = Platform.OS;

  const signin = (data: { email: string, password: string }) => {
    axios.post("http://127.0.0.1:3000/signin",
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then((res) => {
      if (res.status === 200) {
        setEmail(res.data.email);
        saveToken(res.data.accessToken);
        setUsername(res.data.username);
        Alert.alert("Success!", "You have signed in");
        router.navigate("/(tabs)");
        return;
      }
    }).catch((err) => {
      Alert.alert("Error", err.response.data.message);
    });
  }

  const signup = (data: { email: string, password: string, username: string | undefined }) => {
    axios.post("http://127.0.0.1:3000/signup",
      JSON.stringify(data)
    ).then((res) => {
      if (res.status === 201) {
        Alert.alert("Success!", res.data.message);
        router.navigate("/sign-in");
      }
    }).catch((err) => {
      Alert.alert("Error", err.response.data.message);
    });
  };

  const signout = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      axios.post("http://127.0.0.1:3000/signout", {
        token
      }).then(async (res) => {
        if (res.status === 200) {
          setEmail("");
          setToken("");
          setUsername(undefined);
          await AsyncStorage.multiRemove(["token", "username"]);
          router.dismissAll();
        }
      }).catch((err) => {
        if (err.response.data.message === "Access Token has expired") {
          router.navigate("/sign-in");
        }
      })
    }
  };

  return <AuthContext.Provider value={{ email, username, token, signin, signout, signup, platform }}>
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
