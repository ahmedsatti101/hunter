import React, { useContext } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeContext } from "~/context/ThemeContext";

export default function AlertModal({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const insets = useSafeAreaInsets();
  console.log(insets);

  const { darkMode } = useContext(ThemeContext);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent={Platform.OS === "android"}
      onRequestClose={close}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
          <View style={[styles.dialog, { paddingBottom: insets.bottom || 16, backgroundColor: `${darkMode ? '#1b1b1b' : 'white'}` }]}>
            <Text style={[styles.title, { color: `${darkMode ? 'white' : 'black'}` }]}>Delete job?</Text>
            <Text style={[styles.message, { color: `${darkMode ? 'white' : 'black'}` }]}>Are you sure you want to delete this job?</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={close} style={styles.button}>
                <Text style={[styles.buttonText, { color: `${darkMode ? 'white' : 'black'}` }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("entry deleted")} style={styles.button}>
                <Text style={[styles.buttonText, { color: `${darkMode ? 'white' : 'black'}`, backgroundColor: "red" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: { fontWeight: "700", fontSize: 20, marginBottom: 8, fontFamily: "WorkSans-Medium" },
  message: { marginBottom: 16, fontSize: 18, fontFamily: "WorkSans-Medium" },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
  button: { paddingHorizontal: 12, paddingVertical: 1, marginBottom: 0 },
  buttonText: { fontWeight: "600", fontSize: 16, fontFamily: "WorkSans-Medium", borderRadius: 7, padding: 4 },
});
