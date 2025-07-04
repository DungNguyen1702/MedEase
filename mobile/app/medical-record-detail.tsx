import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import InputComponent from "@/components/InputComponent";
import { Colors } from "@/constants/Colors";
import MedicalRecordReExam from "@/components/MedicalRecordReExam";
import MedicalRecordMedicine from "@/components/MedicalRecordMedicine";
import { MedicalRecordAPI } from "@/api/medical-record";
import { formatDateToYYYYMMDD } from "@/utils/string.utils";

export default function MedicalRecordDetail() {
  const { medicalRecordId } = useLocalSearchParams();

  interface Account {
    avatar: string;
    name: string;
  }

  interface Doctor {
    account: Account;
  }

  interface Appointment {
    appointment_date: string;
    "re-exam"?: Array<any>;
  }

  interface MedicalRecord {
    doctor?: Doctor;
    appointment?: Appointment;
    symptoms?: string;
    diagnosis?: string;
    note?: string;
    prescription?: Array<any>;
  }

  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord>({
    doctor: { account: { avatar: "", name: "" } },
    appointment: { appointment_date: "" },
    symptoms: "",
    diagnosis: "",
    note: "",
    prescription: [],
  });

  const callAPI = async () => {
    try {
      const response = await MedicalRecordAPI.getMedicalRecordDetail(
        medicalRecordId as string
      );
      setMedicalRecord(response[0]);
      console.log("Medical Record Detail:", response[0]?.doctor);
    } catch (error) {
      console.error("Error fetching medical record detail:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  console.log("medicalRecordId", medicalRecordId);

  return (
    <ScrollView>
      {/* Information */}
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Bác sĩ khám : </Text>
        <Image
          source={{ uri: medicalRecord?.doctor?.account?.avatar || "" }}
          resizeMode="cover"
          style={styles.avatarImage}
        />
        <Text style={styles.itemValue}>
          {medicalRecord?.doctor?.account?.name}
        </Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Ngày khám : </Text>
        <Text style={styles.itemValue}>
          {formatDateToYYYYMMDD(medicalRecord.appointment?.appointment_date || "")}
        </Text>
      </View>
      <View style={styles.itemColContainer}>
        <Text style={styles.itemTitle}>Triệu chứng</Text>
        <InputComponent
          placeholder="Nhập triệu chứng"
          value={medicalRecord.symptoms}
          editable={false}
          style={styles.inputContainer}
          numberOfLines={3}
          multiline={true}
        />
      </View>
      <View style={styles.itemColContainer}>
        <Text style={styles.itemTitle}>Bệnh chuẩn đoán</Text>
        <InputComponent
          placeholder="Nhập chuẩn đoán"
          value={medicalRecord.diagnosis}
          editable={false}
          style={styles.inputContainer}
          numberOfLines={3}
          multiline={true}
        />
      </View>
      <View style={styles.itemColContainer}>
        <Text style={styles.itemTitle}>Ghi chú</Text>
        <InputComponent
          placeholder="Nhập chuẩn đoán"
          value={medicalRecord.note ? medicalRecord.note : "Không có ghi chú"}
          editable={false}
          style={styles.inputContainer}
          numberOfLines={3}
          multiline={true}
        />
      </View>

      {/* Đơn thuốc */}
      <View style={styles.itemContainer}>
        <View style={[styles.lines, { flex: 1 }]} />
        <Text style={[styles.itemTitle, { marginHorizontal: 10 }]}>
          Đơn thuốc
        </Text>
        <View style={[styles.lines, { flex: 1 }]} />
      </View>
      {(medicalRecord.prescription ?? []).map((item, index) => (
        <MedicalRecordMedicine item={item} key={index} />
      ))}

      {/* Lịch tái khám */}
      <View style={styles.itemColContainer}>
        <View
          style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
        >
          <View style={[styles.lines, { flex: 1 }]} />
          <Text style={[styles.itemTitle, { marginHorizontal: 10 }]}>
            Lịch tái khám
          </Text>
          <View style={[styles.lines, { flex: 1 }]} />
        </View>
        {medicalRecord.appointment?.["re-exam"] ? (
          medicalRecord.appointment?.["re-exam"].map((item, index) => (
            <MedicalRecordReExam key={index} reExam={item} />
          ))
        ) : (
          <View style={styles.noReExamContainer}>
            <Image
              source={require("@/assets/icons/no-calendar.png")}
              style={styles.noReExamImage}
              resizeMode="contain"
            />
            <Text style={[styles.itemValue, { marginTop: 5 }]}>
              Bạn không có lịch tái khám
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  itemColContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginBottom: 5,
  },
  itemValue: {
    fontSize: 14,
    color: Colors.primary.main,
  },
  inputContainer: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.primary.lightBackground,
  },
  lines: {
    height: 2,
    backgroundColor: Colors.primary.main,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  itemImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    overflow: "hidden",
  },
  itemImageText: {
    fontSize: 14,
    color: Colors.primary.main,
  },
  itemImageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginBottom: 5,
  },
  itemImageValue: {
    fontSize: 14,
    color: Colors.primary.main,
  },
  itemImageColContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  itemImageRowContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImageCol: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  itemImageRow: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImageColTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginBottom: 5,
  },
  itemImageColValue: {
    fontSize: 14,
    color: Colors.primary.main,
  },
  noReExamContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noReExamImage: {
    width: 50,
    height: 50,
  },
});
