import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function MedicalRecordMedicine(props: any) {
  const { item } = props;

  return (
    <View style={styles.container}>
      <View style={styles.itemColContainer}>
        <Text style={styles.itemTitle}>Tên thuốc : </Text>
        <Text style={styles.itemValue}>{item.medicine}</Text>
        <Text style={styles.itemTitle}>Liều lượng : </Text>
        <Text style={styles.itemValue}>{item.dosage}</Text>
      </View>
      <View style={styles.itemColContainer}>
        <Text style={[styles.itemTitle, { color: Colors.light.main }]}>
          Số lượng :{" "}
        </Text>
        <Text style={[styles.itemValue, { color: Colors.light.main }]}>
          {item.frequency}
        </Text>
        <Text style={[styles.itemTitle, { color: Colors.light.main }]}>
          Thời gian dùng :{" "}
        </Text>
        <Text style={[styles.itemValue, { color: Colors.light.main }]}>
          {item.duration}
        </Text>
      </View>
      <View style={styles.tagContainer}>
        <Image
          source={require("@/assets/images/medicine.jpg")}
          resizeMode="cover"
          style={styles.tagImage}
        />
        <View style={styles.tagBlur}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.main,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    overflow: "hidden",
    borderColor: Colors.primary.main,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.darkText,
  },
  itemValue: {
    fontSize: 16,
    color: Colors.primary.main,
  },
  tagContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: "100%",
    width: "50%",
    overflow: "hidden",
  },
  tagImage: {
    width: "100%",
    height: "100%",
  },
  tagBlur: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primary.main,
    opacity: 0.7,
  },
  itemColContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 10,
    zIndex: 4,
  },
});
