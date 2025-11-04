import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useRef } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ThemeContext } from "~/context/ThemeContext";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const resetPasswordFormSchema = object().shape({
  code: string()
    .matches(/^\d+$/, { message: "Code must only contain digits", excludeEmptyString: true })
    .required("Please enter code")
    .length(6, "Code must be 6 digits"),
  newPassword: string()
    .required("Password is required")
    .min(12, "Password too short")
    .matches(/\d/g, { message: "Missing at least one digit", excludeEmptyString: true })
    .matches(/[a-z]/g, { message: "Missing lowercase character", excludeEmptyString: true })
    .matches(/[A-Z]/g, { message: "Missing uppercase character", excludeEmptyString: true })
    .matches(/[!@#\$%&\*\(\)\-_+\=\[\]\{\};:'"\\|,<>\.\/\?`~]/g, { message: "Missing special character", excludeEmptyString: true })
    .max(256, "Password maximum length exceeded"),
});

export default function ResetPassword() {
  const { darkMode } = useContext(ThemeContext);
  const passwordInputRef = useRef(null);
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: {
      code: "",
      newPassword: ""
    }
  });
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const resetPassword = (data: { code: string, newPassword: string }) => {
    axios.post("",
      { email, code: data.code, newPassword: data.newPassword }
    ).then((res) => {
      if (res.status === 200) {
        Alert.alert("Success", "Your password has been reset");
        router.navigate("/");
      }
    }).catch((err) => {
      Alert.alert("Error", err.body.message);
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "", headerRight: undefined, headerShadowVisible: false, headerStyle: { backgroundColor: `${darkMode === true ? '#1b1b1b' : '#fff'}` }, headerTintColor: darkMode ? '#fff' : '#000' }} />

      <View className={`flex-1 justify-center items-center ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Text className={`text-center text-4xl ${darkMode === true ? 'text-white' : 'text-black'} m-1`} style={{ fontFamily: boldFont }}>Reset password</Text>

        <Text className={`${darkMode ? 'text-white' : 'text-black'} mb-4 text-sm text-[#737373]`} style={{ fontFamily: mediumFont, fontWeight: "bold" }}>Enter the code sent to your email and set a new password</Text>

        <View className="w-[300px] items-start">
          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode === true ? 'text-white' : 'text-black'}`}
            htmlFor="verification-code"
            nativeID="verification-code"
            testID="verification-code-label"
          >
            Verification code
          </Label>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                style={{ fontFamily: mediumFont }}
                value={value}
                onChangeText={onChange}
                keyboardType="number-pad"
                returnKeyType="next"
                autoFocus={true}
                testID="verification-code-input-field"
                onSubmitEditing={() => passwordInputRef.current.focus()}
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode === true ? 'text-white' : 'text-black'} ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-full`}
              />
            )}
            name="code"
          />
          {errors.code && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.code.message}</Text>}

          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode === true ? 'text-white' : 'text-black'}`}
            htmlFor="verification-code"
            nativeID="verification-code"
            testID="new-password-label"
          >
            New password
          </Label>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                style={{ fontFamily: mediumFont }}
                value={value}
                ref={passwordInputRef}
                onChangeText={onChange}
                textContentType="password"
                secureTextEntry
                returnKeyType="send"
                autoCapitalize="none"
                testID="new-password-input-field"
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode === true ? 'text-white' : 'text-black'} ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-full`}
              />
            )}
            name="newPassword"
          />
          {errors.newPassword && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.newPassword.message}</Text>}
        </View>

        <Button className={`${darkMode ? 'bg-white' : 'bg-black'} m-4 w-[300px]`} onPress={handleSubmit(resetPassword)}>
          <Text className={`${darkMode ? 'text-black' : 'text-white'} text-lg p-4`} style={{ fontFamily: boldFont }}>Reset password</Text>
        </Button>
      </View>
    </>
  )
}
