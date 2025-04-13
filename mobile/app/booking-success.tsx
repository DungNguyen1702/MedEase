import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import FakeData from "@/data/fake_data.json";
import AppointmentDetailComponent from "@/components/AppointmentDetailComponent";

export default function BookingSuccess() {
  const router = useRouter();

  const number = 486;
  const isSuccess = true;

  const appointmentDetails = FakeData.appoinment_detail;

  const handleBackToHome = () => {
    router.push("/(tabs)");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignContent: "center" }}
    >
      <StatusBar
        backgroundColor={Colors.primary.main}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isSuccess ? "Thanh toán thành công" : "Vui lòng chờ đợi"}
        </Text>

        {isSuccess && (
          <Image
            source={require("../assets/icons/party.png")}
            style={styles.headerImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagTitle}>Số của bạn</Text>
            <Text style={styles.tagNumber}>{number}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.thanksText}>
        “ Xin cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ tại bệnh viện
        chúng tôi. Lịch khám của Quý khách đã được xác nhận. Chúng tôi mong được
        phục vụ và chúc Quý khách sức khỏe dồi dào! “
      </Text>

      {/* Body */}
      <View style={styles.body}>
        {appointmentDetails.map((item, index) => {
          return <AppointmentDetailComponent key={index} appointmentDetail={item} />;
        })}
      </View>

      {/* Footer */}
      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary.main,
    width: "100%",
    height: 175,
    marginBottom: 75,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.main,
    textAlign: "center",
    width: "100%",
    marginBottom: 20,
    zIndex: 1,
  },
  headerImage: {
    width: "100%",
    height: 150,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  tagContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    top: 125,
  },
  tag: {
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.main,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  tagNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  thanksText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    textAlign: "center",
    marginHorizontal: 20,
    borderRadius: 10,
  },
  body: { width: "100%", paddingHorizontal: 20 },
  backButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.main,
  },
});
