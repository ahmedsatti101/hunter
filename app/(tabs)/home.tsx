import { BackHandler, View, Text, ScrollView, RefreshControl } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import ThemeToggle from "~/components/ThemeToggle";
import { useAuth } from "~/context/AuthProvider";
import axios from "axios";
import { Button } from "~/components/ui/button";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertModal from "~/components/AlertModal";
import { API_URL } from "~/lib/constants";

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const router = useRouter();
  const { validSession, user } = useAuth();
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const [entries, setEntries] = useState<any[] | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    validSession().then((valid) => {
      if (!valid) router.replace("/");
    });

    const backAction = () => {
      BackHandler.exitApp();
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    axios.get(`${API_URL}/entries/${user?.id}`)
      .then((res) => {
        setEntries(res.data.data)
      })
      .catch(err => console.log(err))

    return () => backHandler.remove();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios.get(`${API_URL}/entries/${user?.id}`)
      .then((res) => {
        setEntries(res.data.data)
        setRefreshing(false);
      })
      .catch(err => console.log(err))
  }, []);

  if (entries?.length === 0 || entries === null) return <Text>Press the + button to track applications</Text>;

  return (
    <>
      <SafeAreaView className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Stack.Screen
          options=
          {{
            headerBackVisible: false,
            headerLeft: undefined,
            title: user?.username ? `Hello, ${user.username}` : "Hunter",
            headerTitleStyle: { fontFamily: "WorkSans-Bold" },
            headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
            headerTintColor: darkMode ? "#fff" : "#000",
            headerRight: () => <ThemeToggle />,
            headerShadowVisible: false
          }}
        />
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {entries?.map((entry) => {
            return (
              <Card
                className={`flex rounded-lg ${darkMode ? 'bg-[#000]' : 'bg-white'} border-black m-4`}
                testID="job-entry-card"
                key={entry.id}
              >
                <CardHeader className="flex-row m-3" testID="card-header">
                  <View className="gap-0.5">
                    <CardTitle
                      style={{ fontFamily: "WorkSans-Bold" }}
                      className={`text-2xl ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                      {entry.title}
                    </CardTitle>
                    <CardDescription
                      style={{ fontFamily: "WorkSans-Medium", color: "#707070" }}
                      className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                      {entry.employer}
                    </CardDescription>
                    <CardDescription
                      style={{ fontFamily: "WorkSans-Medium" }}
                      className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                      Status: {entry.status}
                    </CardDescription>
                  </View>
                </CardHeader>
                <CardFooter className="justify-between m-2 mt-5" testID="card-footer">
                  <Button onPress={() => setAlertModal(true)} testID="delete-job-button">
                    <FontAwesome6 name="trash" size={30} color={`${darkMode ? 'white' : 'black'}`} />
                  </Button>
                  <Button className={`${darkMode ? 'bg-white' : 'bg-black'}`}>
                    <Text
                      style={{ fontFamily: "WorkSans-Medium" }}
                      className={`${darkMode ? 'text-black' : 'text-white'} text-lg p-1.5`}>
                      Edit
                    </Text>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}

          <Button className={`${darkMode ? 'bg-[#fff]' : 'bg-[#000]'} rounded-full p-5`} onPress={() => router.navigate("/create-entry")}>
            <FontAwesome6 name="plus" size={30} color={`${darkMode ? 'black' : 'white'}`} />
          </Button>
        </ScrollView>
        <AlertModal open={alertModal} close={() => setAlertModal(false)} />
      </SafeAreaView>
    </>
  );
}
