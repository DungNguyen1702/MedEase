import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function ButtonComponent({
  backgroundColor,
  title,
  onPress,
  textColor,
  borderColor,
  fontSize,
}: {
  backgroundColor: string;
  title: string;
  onPress: () => void;
  textColor: string;
  borderColor?: string;
  fontSize?: number;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: borderColor ? 2 : 0,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: textColor, fontSize: fontSize ? fontSize : 14 },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
