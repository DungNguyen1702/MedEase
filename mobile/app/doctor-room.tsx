import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import FakeData from "@/data/fake_data.json";
import { getCurrentDate } from "@/utils/string.utils";
import {
  ExaminationStatusColor,
  ExaminationStatusEnum,
} from "@/constants/Constants";
import { Colors } from "@/constants/Colors";

export default function DoctorRoom() {
  const { doctorId } = useLocalSearchParams();
  const doctor = FakeData.doctors[0];
  const appointmentDetail = FakeData.appoinment_detail;
  const currentNumber = 486;

  console.log(doctorId);
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCircle}></View>
        {/* Information */}
        <View style={{ padding: 20 }}>
          {/* Doctor name */}
          <Text style={styles.headerText}>
            <Text style={{ fontWeight: "bold" }}>Bác sĩ : </Text>
            <Text>{doctor.name}</Text>
          </Text>

          {/* Current date */}
          <Text style={styles.headerText}>
            <Text style={{ fontWeight: "bold" }}>Ngày khám : </Text>
            <Text>{getCurrentDate()}</Text>
          </Text>

          {/* Room */}
          <Text style={styles.headerText}>
            <Text style={{ fontWeight: "bold" }}>Phòng : </Text>
            <Text>{doctor.room}</Text>
          </Text>

          {/* Appointment number */}
          <Text style={styles.headerText}>
            <Text style={{ fontWeight: "bold" }}>Số lịch hẹn : </Text>
            <Text>{appointmentDetail.length}</Text>
          </Text>

          {/* Specialization */}
          <Text style={styles.headerText}>
            <Text style={{ fontWeight: "bold" }}>Chuyên khoa : </Text>
            <Text>{doctor.specialization.name}</Text>
          </Text>
        </View>

        {/* Current Number */}
        <View style={styles.headerCurrentNumContainer}>
          <Text style={styles.headerCurrentNumTitle}>Số hiện tại</Text>
          <Text style={styles.headerCurrentNum}>{currentNumber}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Body header */}
        <View style={styles.bodyHeader}>
          {Object.entries(ExaminationStatusEnum).map(([key, value]) => (
            <View key={key} style={styles.bodyHeaderItem}>
              <View
                style={[
                  styles.bodyHeaderSquare,
                  {
                    backgroundColor:
                      ExaminationStatusColor[
                        key as keyof typeof ExaminationStatusColor
                      ],
                  },
                ]}
              ></View>
              <Text
                style={[
                  styles.valueText,
                  {
                    color:
                      ExaminationStatusColor[
                        key as keyof typeof ExaminationStatusColor
                      ],
                  },
                ]}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>

        {/* Body content */}

        <View style={styles.bodyContentHeader}>
          <Text
            style={[
              styles.bodyContentNum,
              { fontWeight: "bold", color: Colors.primary.main },
            ]}
          >
            Số
          </Text>
          <Text
            style={[
              styles.bodyContentPatientName,
              { fontWeight: "bold", color: Colors.primary.main },
            ]}
          >
            Bệnh nhân
          </Text>
          <Text
            style={[
              styles.bodyContentTime,
              { fontWeight: "bold", color: Colors.primary.main },
            ]}
          >
            Thời gian
          </Text>
        </View>
        <View>
          {appointmentDetail.map((item, index) => {
            return (
              <View key={index} style={styles.bodyItemContainer}>
                <Text
                  style={[
                    styles.bodyContentNum,
                    {
                      color:
                        ExaminationStatusColor[
                          item.examStatus as keyof typeof ExaminationStatusColor
                        ],
                    },
                  ]}
                >
                  {item.appointment.number}
                </Text>
                <Text
                  style={[
                    styles.bodyContentPatientName,
                    {
                      color:
                        ExaminationStatusColor[
                          item.examStatus as keyof typeof ExaminationStatusColor
                        ],
                    },
                  ]}
                >
                  {item.appointment.patient.name}
                </Text>
                <Text
                  style={[
                    styles.bodyContentTime,
                    {
                      color:
                        ExaminationStatusColor[
                          item.examStatus as keyof typeof ExaminationStatusColor
                        ],
                    },
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
  },
  header: {
    marginBottom: 80,
  },
  headerTitleContainer: {
    marginBottom: 10,
  },
  headerCircle: {
    width: "100%",
    height: "150%",
    backgroundColor: Colors.primary.main,
    position: "absolute",
    top: -20,
    left: 0,
    borderBottomStartRadius: 150,
    borderBottomEndRadius: 150,
  },
  headerCurrentNumContainer: {
    backgroundColor: Colors.primary.lightBackground,
    padding: 10,
    marginHorizontal: 50,
    borderRadius: 10,
  },
  headerCurrentNumTitle: {
    fontSize: 16,
    color: Colors.primary.main,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerCurrentNum: {
    fontSize: 30,
    color: Colors.primary.darkText,
    fontWeight: "bold",
    textAlign: "center",
  },
  body: {
    padding: 20,
    backgroundColor: Colors.light.main,
  },
  bodyHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bodyHeaderItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: Colors.light.main,
    fontSize: 16,
    marginBottom: 5,
  },
  bodyHeaderSquare: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  valueText: {
    fontSize: 16,
    color: Colors.light.main,
  },
  bodyContentHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.main,
    paddingBottom: 10,
  },
  bodyContentNum: {
    fontSize: 16,
    color: Colors.light.main,
    width: "15%",
    borderRightWidth: 2,
    borderRightColor: Colors.primary.main,
  },
  bodyContentPatientName: {
    fontSize: 16,
    color: Colors.light.main,
    width: "65%",
    borderRightWidth: 2,
    borderRightColor: Colors.primary.main,
    textAlign: "center",
  },
  bodyContentTime: {
    fontSize: 16,
    color: Colors.light.main,
    width: "20%",
    textAlign: "center",
  },
  bodyItemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.main,
    paddingBottom: 10,
    marginBottom: 10,
  },
  bodyItemNum: {
    fontSize: 16,
    color: Colors.light.main,
  },
  bodyItemPatientName: {
    fontSize: 16,
    color: Colors.light.main,
  },
  bodyItemTime: {
    fontSize: 16,
    color: Colors.light.main,
  },
  bodyItemStatus: {
    fontSize: 16,
    color: Colors.light.main,
  },
  bodyItemStatusSquare: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 5,
  },
});
