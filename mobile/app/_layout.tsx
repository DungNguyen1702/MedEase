import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux"; // Import Provider từ react-redux
import { store } from "@/redux/store"; // Import store từ Redux

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
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
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="spec-detail"
          options={{
            headerShown: true,
            title: "Chi tiết chuyên khoa",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="doctor-room"
          options={{
            headerShown: true,
            title: "Phòng khám bác sĩ",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="account-info-edit"
          options={{
            headerShown: true,
            title: "Chỉnh sửa thông tin",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            headerShown: true,
            title: "Thay đổi mật khẩu",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="appointment-history"
          options={{
            headerShown: true,
            title: "Lịch sử cuộc hẹn",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="medical-record"
          options={{
            headerShown: true,
            title: "Sổ khám bệnh",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="medical-record-detail"
          options={{
            headerShown: true,
            title: "Chi tiết hồ sơ khám bệnh",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="appointment-detail"
          options={{
            headerShown: true,
            title: "Chi tiết lịch hẹn",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
        <Stack.Screen
          name="contact"
          options={{
            headerShown: true,
            title: "Liên hệ bệnh viện",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTitleAlign: "center",
            headerTintColor: Colors.light.main,
            headerBackTitle: "Quay lại",
          }}
        />
      </Stack>
    </Provider>
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
