import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TruncateText } from "@/utils/string.utils";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { doctorAPI } from "@/api/doctor";

export default function DoctorSpecComponent(props: any) {
  const router = useRouter();

  const { doctor, key } = props;

  const [currentNumber, setCurrentNumber] = useState(0);

  const callAPI = async () => {
    try {
      const response = await doctorAPI.getCurrentNumber(doctor._id);
      setCurrentNumber(response);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const onClickDoctor = () => {
    router.push({
      pathname: "/doctor-room",
      params: { doctorId: doctor._id },
    });
  };

  return (
    <TouchableOpacity
      key={key}
      style={styles.container}
      onPress={onClickDoctor}
    >
      <View style={styles.mark}></View>
      <View style={styles.bodyContainer}>
        <Text style={styles.doctorName}>{doctor.account.name}</Text>
        <Text style={styles.doctorAddress}>
          <Text style={{ fontWeight: "bold" }}>Phòng : </Text>
          <Text>{TruncateText(doctor.room, 10)}</Text>
        </Text>
        <Image
          source={{ uri: doctor.account.avatar }}
          resizeMode="cover"
          style={styles.avatarImage}
        />
        <View>
          <Text style={[styles.doctorNumber, { fontWeight: "bold" }]}>
            Số hiện tại :{" "}
          </Text>
          <Text style={styles.doctorNumber}>
            {currentNumber != 0 ? currentNumber : "Không có"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.primary.main,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  bodyContainer: {
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  mark: {
    width: "100%",
    height: "60%",
    backgroundColor: Colors.primary.lightBackground,
    borderRadius: 5,
    position: "absolute",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    top: "-10%",
    left: 0,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    textAlign: "center",
  },
  doctorAddress: {
    fontSize: 14,
    color: Colors.primary.main,
    marginTop: 5,
  },
  doctorNumber: {
    fontSize: 20,
    color: Colors.primary.main,
    marginTop: 5,
    textAlign: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
