import { Stack, useRouter } from "expo-router";
import { useContext, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ThemeContext } from "~/context/ThemeContext";
import { object, string, ObjectSchema, ref } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Loading from "~/screens/Loading";

interface UserSignUp {
  email: string;
  password: string;
  confirmPassword: string;
}

const createYupSchema = <T extends object>(schema: ObjectSchema<T>): ObjectSchema<T> => schema;

const userFormSchema = createYupSchema<UserSignUp>(
  object().shape({
    email: string()
      .required("Email is required")
      .email("Invalid email format"),
    password: string()
      .required("Password is required")
      .min(12, "Password too short")
      .matches(/\d/g, { message: "Missing at least one digit", excludeEmptyString: true })
      .matches(/[a-z]/g, { message: "Missing lowercase character", excludeEmptyString: true })
      .matches(/[A-Z]/g, { message: "Missing uppercase character", excludeEmptyString: true })
      .matches(/[!@#\$%&\*\(\)\-_+\=\[\]\{\};:'"\\|,<>\.\/\?`~]/g, { message: "Missing special character", excludeEmptyString: true })
      .max(256, "Password maximum length exceeded"),
    confirmPassword: string()
      .required("Please retype your password").oneOf([ref("password")], "Passwords don't match")
  })
);

export default function SignUp() {
  const { darkMode } = useContext(ThemeContext);
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const PASSREQS = [
    "Minimum of 12 characters",
    "Must contain at least one digit",
    "Must contain a lowercase character",
    "Must contain a uppercase character",
    "Must contain a special character"
  ];
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>();

  const handleSignUp = (formData: UserSignUp) => {
    setLoading(true);
    axios.post("/signup",
      formData
    ).then((res) => {
      if (res.status === 201) {
        Alert.alert("Success!", res.data.message);
        setLoading(false);
        router.navigate("/sign-in");
      } else {
        return;
      }
    }).catch((err) => {
      Alert.alert("Error", err.response.data.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  if (loading) return <Loading />;

  return (
    <View className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>

      <Stack.Screen options={{ headerTitle: "", headerRight: undefined, headerStyle: { backgroundColor: `${darkMode ? '#1b1b1b' : '#fff'}` }, headerTintColor: darkMode ? '#fff' : '#000', headerShadowVisible: false }} />

      <Text className={`text-4xl ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: boldFont }} testID="signin-screen-header">Sign up</Text>

      <View className="m-2">
        <Label
          style={{ fontFamily: mediumFont, fontWeight: "bold" }}
          className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`}
          htmlFor="email"
          nativeID="email"
        >
          Email
        </Label>

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              testID="email-input-field"
              className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              returnKeyType="next"
              autoCapitalize="none"
              autoFocus={true}
              textContentType="emailAddress"
              autoComplete="email"
              style={{ fontFamily: mediumFont }}
              onSubmitEditing={() => passwordInputRef.current.focus()}
            />
          )}
          name="email"
        />
        {errors.email && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.email.message}</Text>}

        <Label
          style={{ fontFamily: mediumFont, fontWeight: "bold" }}
          className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-2`}
          htmlFor="password"
          nativeID="password"
        >
          Create Password
        </Label>

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              testID="password-input-field"
              className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}

              textContentType="password"
              secureTextEntry
              ref={passwordInputRef}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
            />
          )}
          name="password"
        />
        {errors.password && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.password.message}</Text>}

        <Text style={{ fontFamily: boldFont }} className="text-md mt-2 text-[#7b7b7b]">Password requirements:</Text>
        {PASSREQS.map((req, idx) => {
          return (
            <Text key={idx} testID="password-requirements" style={{ fontFamily: boldFont }} className="text-[15px] text-[#7b7b7b]">{req}</Text>
          )
        })}


        <Label
          style={{ fontFamily: mediumFont, fontWeight: "bold" }}
          className={`text-xl ${darkMode ? 'text-white' : 'text-black'} mt-1`}
          htmlFor="confirmPassword"
          nativeID="confirmPassword"
        >
          Confirm Password
        </Label>

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              testID="confirm-password-input-field"
              className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}

              textContentType="password"
              secureTextEntry
              ref={confirmPasswordInputRef}
              autoCapitalize="none"
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.confirmPassword.message}</Text>}
      </View>

      <Button testID="signup-btn" className={`${darkMode ? 'bg-white' : 'bg-[#000]'} ml-60 mt-3`} onPress={handleSubmit(handleSignUp)}>
        <Text className={`${darkMode ? 'text-black' : 'text-white'} border rounded-md p-4 text-lg`} style={{ fontFamily: boldFont }}>Sign up</Text>
      </Button>
    </View>
  )
};
