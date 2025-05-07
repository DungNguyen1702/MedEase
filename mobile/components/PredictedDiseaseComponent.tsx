import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { TruncateText } from "@/utils/string.utils";
import InputComponent from "./InputComponent";

export default function PredictedDiseaseComponent(props: any) {
  const { index, predictedDisease } = props;
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { width: "15%", textAlign: "center" }]}>
        {index}
      </Text>
      <InputComponent
        value={predictedDisease.name}
        editable={false}
        style={[styles.text, { width: "55%", color: "black" }]}
      />

      <Text style={[styles.text, { width: "25%", textAlign: "center" }]}>
        {Number(predictedDisease.percent) % 1 === 0
          ? Number(predictedDisease.percent) // Nếu là số nguyên, hiển thị nguyên
          : Number(predictedDisease.percent).toFixed(2)}
        %
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    borderColor: Colors.primary.main,

    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
