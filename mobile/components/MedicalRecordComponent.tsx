import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function MedicalRecordComponent(props: any) {
  const router = useRouter();

  const { medicalRecord } = props;

  const handlePress = () => {
    router.push({
      pathname: "/medical-record-detail",
      params: { medicalRecordId: medicalRecord._id },
    });
    console.log("Medical record pressed:", medicalRecord);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.itemContainer}>
        <Text style={[styles.itemHeader, { color: Colors.primary.darkText }]}>
          Bệnh
        </Text>
        <Text style={[styles.itemContent, { color: Colors.primary.main }]}>
          {medicalRecord.diagnosis}
        </Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={[styles.itemHeader, { color: Colors.light.main }]}>
          Triệu chứng
        </Text>
        <Text style={[styles.itemContent, { color: Colors.light.main }]}>
          {medicalRecord.symptoms}
        </Text>
      </View>
      <Text style={styles.date}>{medicalRecord.createdAt}</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>Chi tiết</Text>
        <Image
          source={require("../assets/icons/white-right-arrow.png")}
          style={styles.arrowIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.backgroundImageRight}>
        <Image
          source={require("../assets/images/disease.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.backgroundBlur}></View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    borderColor: Colors.primary.main,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 200,
  },
  itemContainer: {
    width: "50%",
    zIndex: 6,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  itemHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContent: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 4,
  },
  detailText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.main,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  backgroundImageRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    minHeight: 200,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  backgroundBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primary.main,
    opacity: 0.6,
  },
});
