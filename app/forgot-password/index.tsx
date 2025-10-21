import { router, Stack } from "expo-router";
import { useContext } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ThemeContext } from "~/context/ThemeContext";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const forgotPasswordFormSchema = object().shape({
  email: string().required("Email is required").email("Invalid email format")
})

export default function ForgotPassword() {
  const { darkMode } = useContext(ThemeContext);
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    }
  });

  const sendPasswordResetCode = (data: { email: string }) => {
    axios.post("",
      data
    ).then((res) => {
      if (res.status === 200) {
        router.setParams({ email: data.email })
        router.push({ pathname: "/reset-password", params: { email: data.email } })
      }
    }).catch((err) => {
      Alert.alert("Error", err.body.message);
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "", headerRight: undefined, headerStyle: { backgroundColor: `${darkMode === true ? '#1b1b1b' : '#fff'}` }, headerTintColor: darkMode ? '#fff' : '#000' }} />

      <View className={`flex-1 justify-center items-center ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Text className={`text-center text-4xl ${darkMode === true ? 'text-white' : 'text-black'} m-1`} style={{ fontFamily: boldFont }}>Forgot password?</Text>

        <Text className={`${darkMode ? 'text-white' : 'text-black'} mb-4 text-base text-[#737373]`} style={{ fontFamily: mediumFont, fontWeight: "bold" }}>Enter your email to reset your password</Text>

        <View className="w-[300px] items-start">
          <Label
            style={{ fontFamily: mediumFont, fontWeight: "bold" }}
            className={`text-xl ${darkMode === true ? 'text-white' : 'text-black'}`}
            htmlFor="email"
            nativeID="email"
            testID="email-label"
          >
            Email
          </Label>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                style={{ fontFamily: mediumFont }}
                value={value}
                onChangeText={onChange}
                placeholder="john.doe@example.com"
                placeholderTextColor="#737373"
                keyboardType="email-address"
                returnKeyType="send"
                autoFocus={true}
                autoCapitalize="none"
                textContentType="emailAddress"
                autoComplete="off"
                testID="email-input-field"
                className={`p-2 border-[#a7a7a7] rounded-lg text-xl ${darkMode === true ? 'text-white' : 'text-black'} ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-full`}
              />
            )}
            name="email"
          />
          {errors.email && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.email.message}</Text>}

        </View>

        <Button className={`${darkMode ? 'bg-white' : 'bg-black'} m-4 w-[300px]`} onPress={handleSubmit(sendPasswordResetCode)}>
          <Text className={`${darkMode ? 'text-black' : 'text-white'} text-lg p-4`} style={{ fontFamily: boldFont }}>Reset password</Text>
        </Button>
      </View>
    </>
  )
}
