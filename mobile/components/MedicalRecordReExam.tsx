import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import ButtonComponent from "./ButtonComponent";
import { useRouter } from "expo-router";
import { formatDateToYYYYMMDD } from "@/utils/string.utils";

export default function MedicalRecordReExam(props: any) {
  const router = useRouter();
  const { reExam } = props;

  const handlePress = () => {
    router.push({
      pathname: "/(tabs)/schedule",
      params: {
        reExamId: reExam._id,
        doctorId: reExam?.doctor?._id,
        specilizationId: reExam?.doctor?.specialization_id,
        appointmentId: reExam?.appointment_id,
        reExamDate: reExam.re_exam_date,
        doctorName: reExam?.doctor?._id,
      },
    });
    console.log("Đặt lịch tái khám");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        <Text style={[styles.tagText, { fontWeight: "bold" }]}>
          Ngày tái khám
        </Text>
        <Text style={styles.tagText}>
          {formatDateToYYYYMMDD(reExam.re_exam_date)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text>
          <Text style={styles.itemTitle}>Bác sĩ : </Text>
          <Text style={styles.itemValue}>{reExam?.doctor?.account?.name}</Text>
        </Text>
        <Text style={styles.itemTitle}>Ghi chú</Text>
        <Text style={styles.itemValue}>{reExam.note}</Text>
      </View>
      {!reExam.appointment_id && (
        <ButtonComponent
          backgroundColor={Colors.primary.main}
          title="Đặt lịch"
          onPress={handlePress}
          textColor={Colors.light.main}
          borderColor={Colors.primary.main}
          fontSize={14}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    overflow: "hidden",
    borderColor: Colors.primary.main,
    borderWidth: 1,
  },
  tagContainer: {
    padding: 10,
    backgroundColor: Colors.primary.main,
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  tagText: {
    fontSize: 16,
    color: Colors.light.main,
  },
  infoContainer: {
    marginTop: 5,
    marginLeft: "40%",
    paddingTop: 20,
    paddingBottom: 50,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary.darkText,
  },
  itemValue: {
    fontSize: 14,
    color: Colors.primary.main,
  },
  button: {
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    right: 10,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
