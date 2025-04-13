import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function PredictedDiseaseComponent(props: any) {
  const { index, predictedDisease } = props;
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { width: "15%" }]}>{index}</Text>
      <Text style={[styles.text, { width: "65%" }]}>
        {predictedDisease.name}
      </Text>
      <Text style={[styles.text, { width : "15%"}]}>{predictedDisease.probability}</Text>
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
