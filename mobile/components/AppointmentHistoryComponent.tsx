import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { AppointmentStatus } from "@/constants/Constants";
import { TruncateText } from "@/utils/string.utils";

interface AppointmentProps {
  number: string;
  title: string;
  time: string;
  date: string;
  symptoms: string;
  status: keyof typeof AppointmentStatus;
}

export default function AppointmentComponent({
  number,
  title,
  time,
  date,
  symptoms,
  status,
}: AppointmentProps) {
  const getStatusStyle = () => {
    switch (status) {
      case "done":
        return styles.statusUpcoming;
      case "wait":
        return styles.statusInProgress;
      case "cancel":
        return styles.statusCompleted;
      default:
        return styles.statusUpcoming;
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{number}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoHeaderContainer}>
          <Text style={styles.title}>{TruncateText(title, 14)}</Text>
          <View style={[styles.statusButton, getStatusStyle()]}>
            <Text style={styles.statusText}>{AppointmentStatus[status]}</Text>
          </View>
        </View>
        <Text style={styles.detail}>
          <Text style={{ fontWeight: "bold" }}>Thời gian:</Text>
          <Text>{time}</Text>
        </Text>
        <Text style={styles.detail}>
          <Text style={{ fontWeight: "bold" }}>Ngày khám: </Text>
          <Text>{date}</Text>
        </Text>
        <Text style={[styles.detail, { fontWeight: "bold" }]}>Triệu chứng</Text>
        <Text style={styles.symptoms}>{symptoms}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.light.main,
    borderRadius: 10,
    marginVertical: 5,
    overflow: "hidden",
    borderColor: Colors.primary.main,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  numberContainer: {
    width: 80,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderTopRightRadius: 300,
    borderBottomRightRadius: 300,
    zIndex: 1,
  },
  number: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    paddingRight: 20,
    justifyContent: "space-between",
    marginLeft: 85,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.darkText,
  },
  detail: {
    fontSize: 14,
    color: Colors.primary.main,
    marginBottom: 10,
  },
  symptoms: {
    fontSize: 14,
    color: Colors.primary.main,
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  statusUpcoming: {
    backgroundColor: Colors.success.background,
  },
  statusInProgress: {
    backgroundColor: Colors.warning.background,
  },
  statusCompleted: {
    backgroundColor: Colors.danger.background,
  },
  infoHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});
