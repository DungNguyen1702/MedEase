import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { TruncateText } from "@/utils/string.utils";
import { useRouter } from "expo-router";

export default function AppointmentDetailComponent(props: any) {
  const router = useRouter();
  const { appointmentDetail } = props;
  const onPressAppointmentDetail = () => {
    router.push({
      pathname: "/doctor-room",
      params: {
        doctorId: appointmentDetail?.doctor?._id,
      },
    });
  };
  return (
    <TouchableOpacity
      onPress={onPressAppointmentDetail}
      style={styles.container}
    >
      <View style={styles.tag}></View>
      <View
        style={{ paddingVertical: 20, display: "flex", flexDirection: "row" }}
      >
        <Image
          source={{ uri: appointmentDetail?.doctor?.avatar }}
          style={styles.doctorImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Phòng</Text>{" "}
            {TruncateText(appointmentDetail.address, 20)}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Bác sĩ</Text>{" "}
            {TruncateText(appointmentDetail.doctor.name, 20)}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Thời gian</Text>{" "}
            {appointmentDetail.time}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Ngày khám</Text>{" "}
            {appointmentDetail.appointment.appointment_date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.light.main,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    paddingLeft: 30,
    marginVertical: 10,
    overflow: "hidden",
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  tag: {
    backgroundColor: Colors.primary.main,
    position: "absolute",
    top: 0,
    left: 0,
    width: 15,
    height: "100%",
  },
  infoContainer: {
    paddingLeft: 20,
    display: "flex",
    justifyContent: "center",
    width: Dimensions.get("window").width - 150,
  },
});
