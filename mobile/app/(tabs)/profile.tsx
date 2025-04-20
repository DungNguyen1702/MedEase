import {
  StyleSheet,
  Image,
  Platform,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import FakeData from "@/data/fake_data.json";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();
  const account = FakeData.account;

  const buttons = [
    {
      title: "Chỉnh sửa thông tin",
      onPress: () => {
        router.push("/account-info-edit");
        console.log("Edit account");
      },
    },
    {
      title: "Đổi mật khẩu",
      onPress: () => {
        router.push("/change-password");
        console.log("Change password");
      },
    },
    {
      title: "Lịch sử khám bệnh",
      onPress: () => {
        router.push("/appointment-history");
        console.log("Appointment history");
      },
    },
    {
      title: "Sổ khám bệnh",
      onPress: () => {
        router.push("/medical-record");
        console.log("Sổ khám bệnh");
      },
    },
    {
      title: "Liên hệ",
      onPress: () => {
        router.push("/contact");
        console.log("Liên hệ");
      },
    },
    {
      title: "Đăng xuất",
      onPress: () => {
        router.push("/login");
        console.log("Logout");
      },
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      <StatusBar
        backgroundColor={Colors.primary.main}
        barStyle="light-content"
      />
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: account.avatar }}
          resizeMode="cover"
          style={styles.userAvatar}
        />
        <Text style={styles.userName}>{account.name}</Text>
        <Text style={styles.userEmail}>{account.email}</Text>
        <View style={styles.headerTableContainer}>
          <View style={styles.headerTableItem}>
            <Text style={styles.headerTableTitle}>Tổng số lịch hẹn</Text>
            <Text style={styles.headerTableValue}>
              {" "}
              {account.TotalAppointment}
            </Text>
          </View>
          <View style={styles.headerLine}></View>
          <View style={styles.headerTableItem}>
            <Text style={styles.headerTableTitle}>Số lịch hẹn hôm nay</Text>
            <Text style={styles.headerTableValue}>
              {" "}
              {account.TodayAppointment}
            </Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.bodyContainer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={button.onPress}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.primary.main,
    marginBottom: 70,
    paddingBottom: 50,
    paddingTop: 50,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.light.main,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.main,
    marginBottom: 10,
  },
  headerLine: {
    width: 2,
    height: "100%",
    backgroundColor: Colors.primary.main,
    marginHorizontal: 10,
  },
  headerTableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    backgroundColor: Colors.light.main,
    borderRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: -70,
    borderColor: Colors.primary.main,
    borderWidth: 1,
  },
  headerTableItem: {
    alignItems: "center",
  },
  headerTableTitle: {
    fontSize: 12,
    color: Colors.primary.main,
    fontWeight: "bold",
  },
  headerTableValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary.darkText,
  },
  bodyContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingVertical: Platform.OS === "web" ? "3%" : "5%",
    borderColor: Platform.OS === "web" ? "#ccc" : Colors.light.main + "00",
    alignItems: "center",
    backgroundColor: Colors.primary.main,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.light.main,
    fontWeight: "bold",
  },
});
