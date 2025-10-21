import { router, Stack } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { object, string, ObjectSchema } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "~/components/ui/label";
import { useContext, useRef, useState } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "~/screens/Loading";

interface UserSignIn {
  email: string;
  password: string;
}

const createYupSchema = <T extends object>(schema: ObjectSchema<T>): ObjectSchema<T> => schema;

const userFormSchema = createYupSchema<UserSignIn>(
  object().shape({
    email: string()
      .required("Email is required")
      .email("Invalid email format"),
    password: string()
      .required("Password is required")
  })
);

export default function SignInWithEmail() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const passwordInputRef = useRef(null);
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState<boolean>();
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";

  const saveCredentials = async (email: string, username: string | undefined) => {
    try {
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.removeItem("username");
      if (username) {
        await AsyncStorage.setItem("username", username);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const submitToCognito = (formData: UserSignIn) => {
    setLoading(true);
    axios.post("/signin",
      formData
    ).then((res) => {
      if (res.status === 200) {
        Alert.alert("Success!", "You have signed in");
        setLoading(false);
        router.navigate("/(tabs)");
        saveCredentials(res.data.email, res.data.username);
      } else {
        return;
      }
    }).catch((err) => {
      Alert.alert("Error", err.body.message);
    });
  };

  if (loading) return <Loading />;

  return (
    <View className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
      <Stack.Screen options={{ headerTitle: "", headerRight: undefined, headerStyle: { backgroundColor: `${darkMode ? '#1b1b1b' : '#fff'}` }, headerTintColor: darkMode ? '#fff' : '#000' }} />

      <Text className={`text-4xl ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: boldFont }} testID="signin-screen-header">Sign in</Text>

      <View className="m-2">
        <Label style={{ fontFamily: mediumFont, fontWeight: "bold" }} className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`} htmlFor="email" nativeID='email'>Email</Label>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current.focus()}
              autoCapitalize="none"
              autoFocus={true}
              textContentType="emailAddress"
              autoComplete="off"
              style={{ fontFamily: mediumFont }}
              testID="email-input-field"
              className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
            />
          )}
          name="email"
        />
        {errors.email && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.email.message}</Text>}
      </View>

      <View className="m-2">
        <Label style={{ fontFamily: mediumFont, fontWeight: "bold" }} className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`} htmlFor="password" nativeID='password'>Password</Label>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              textContentType="password"
              secureTextEntry
              value={value}
              autoCapitalize="none"
              onChangeText={onChange}
              ref={passwordInputRef}
              testID="password-input-field"
              className={`p-2 border-[#a7a7a7] rounded-lg text-xl h-[50px] w-[300px] ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}
            />
          )}
          name="password"
        />
        {errors.password && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.password.message}</Text>}

        <Button className="justify-start mt-3" onPress={() => router.navigate("/forgot-password")}>
          <Text className="text-base underline text-[#4160de] text-xl" style={{ fontFamily: mediumFont }}>Forgot password?</Text>
        </Button>
      </View>
      <Button testID="signin-btn" className={`${darkMode ? 'bg-white' : 'bg-[#000]'} ml-60 mt-3`} onPress={handleSubmit(submitToCognito)}>
        <Text className={`${darkMode ? 'text-black' : 'text-white'} border rounded-md p-4 text-lg`} style={{ fontFamily: mediumFont }}>Sign in</Text>
      </Button>
    </View>
  );
};
