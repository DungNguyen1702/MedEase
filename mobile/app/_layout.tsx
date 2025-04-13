import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="booking-success" options={{ headerShown: false }} />
      <Stack.Screen
        name="list-appointment"
        options={{
          headerShown: true,
          title: "Lịch hẹn",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign : "center",
          headerTintColor: Colors.light.main,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Colors.primary.main, // Đặt màu nền cho header
  },
  headerTitleStyle: {
    textAlign: "center", // Căn giữa tiêu đề
    fontWeight: "bold", // Tùy chọn: Đặt font chữ đậm
    color: Colors.light.main, // Đặt màu chữ
  },
});
