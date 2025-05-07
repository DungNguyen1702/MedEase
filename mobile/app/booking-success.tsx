import {
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import FakeData from "@/data/fake_data.json";
import AppointmentDetailComponent from "@/components/AppointmentDetailComponent";
import { useSearchParams } from "expo-router/build/hooks";
import { AppointmentDetailAPI } from "@/api/appointment-detail";
import { AppointmentAPI } from "@/api/appointment";
import { convertTimeToMilliseconds } from "@/utils/time.utils";
import { PaymentWaitTime } from "@/constants/Constants";

const delayWithTimeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default function BookingSuccess() {
  const router = useRouter();

  let interval: ReturnType<typeof setInterval> | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");

  const paymentCode = searchParams.get("paymentCode");
  const paymentMethod = searchParams.get("paymentMethod");

  const paymentLink = searchParams.get("paymentLink");

  const [number, setNumber] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [message, setMessage] = useState(
    `“ Xin cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ tại bệnh viện chúng tôi. Lịch khám của Quý khách ${
      isSuccess ? "đã" : "đang"
    } được xác nhận. Chúng tôi mong được phục vụ và chúc Quý khách sức khỏe dồi dào! “`
  );

  const callAPI = async () => {
    console.log("appointmentId : ", paymentCode, paymentMethod, paymentLink);

    if (appointmentId) {
      const response = await AppointmentAPI.getAppHistoryDetail(appointmentId);
      console.log("response detail : ", response);
      setAppointmentDetails(response[0].appointment_detail);
      setIsSuccess(true);
      setNumber(response[0].number);
    }

    if (paymentCode && paymentMethod && paymentLink) {
      const checkPaymentStatus = async () => {
        try {
          let response;
          if (paymentMethod === "momo") {
            response = await AppointmentAPI.checkStatusMomo(paymentCode);
          } else if (paymentMethod === "zalopay") {
            response = await AppointmentAPI.checkStatusZalo(paymentCode);
          }

          console.log("Payment status response:", response.resultCode);

          console.log("Payment status response:", response.return_code);

          console.log(
            (paymentMethod === "zalopay" && response?.return_code === 1) ||
              (paymentMethod === "momo" && response?.resultCode === 99)
          );
          if (
            (paymentMethod === "zalopay" && response?.return_code === 1) ||
            (paymentMethod === "momo" && response?.resultCode === 99)
          ) {
            console.log("Payment successful");
            if (interval) {
              clearInterval(interval);
            }
            if (timeout) {
              clearTimeout(timeout);
            }

            await delayWithTimeout(5000);

            const detailResponse =
              await AppointmentAPI.getAppoinemtmentDetailPayment(
                paymentCode,
                paymentMethod
              );
            console.log("response detail : ", detailResponse);
            setAppointmentDetails(detailResponse[0].appointment_detail);
            setIsSuccess(true);
            setNumber(detailResponse[0].number);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };

      // Đặt thời gian chờ tối đa
      const maxWaitTime = convertTimeToMilliseconds(
        PaymentWaitTime[paymentMethod as keyof typeof PaymentWaitTime]
      );
      timeout = setTimeout(() => {
        clearInterval(interval!); // Dừng kiểm tra định kỳ
        setIsSuccess(false); // Đặt trạng thái thanh toán thất bại
        Alert.alert("Thông báo", "Thanh toán thất bại. Vui lòng thử lại", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ]);
      }, maxWaitTime);

      // Kiểm tra trạng thái thanh toán định kỳ (cách 5 giây)
      interval = setInterval(checkPaymentStatus, 10000);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const handleBackToHome = () => {
    if (interval) {
      clearInterval(interval);
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    router.replace("/(tabs)");
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
        <Image
          source={
            isSuccess
              ? require("../assets/icons/party.png")
              : require("../assets/icons/sand.png")
          }
          style={styles.headerImage}
          resizeMode="cover"
        />
        {isSuccess && (
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagTitle}>Số của bạn</Text>
              <Text style={styles.tagNumber}>{number}</Text>
            </View>
          </View>
        )}
      </View>
      <Text style={styles.thanksText}>{message}</Text>

      {/* Body */}
      <View style={styles.body}>
        {appointmentDetails.map((item, index) => {
          return (
            <AppointmentDetailComponent key={index} appointmentDetail={item} />
          );
        })}
      </View>

      {/* Footer */}
      {paymentLink && !isSuccess && (
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={() => Linking.openURL(paymentLink)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Thanh toán ngay</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginTop: 20,
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
    marginVertical: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.main,
  },
});
