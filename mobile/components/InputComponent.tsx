import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";

export default function InputComponent(props: any) {
  const {
    value,
    onChangeText,
    placeholder,
    style = {},
    numberOfLines = 1,
    multiline = false,
  } = props;

  const [inputHeight, setInputHeight] = useState(40);

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.primary.mainLight}
      onContentSizeChange={(e) => {
        if (multiline) {
          setInputHeight(e.nativeEvent.contentSize.height); // Cập nhật chiều cao
        }
      }}
      style={[
        styles.inputText,
        style,
        multiline && { height: Math.max(40, inputHeight) }, // Đảm bảo chiều cao tối thiểu là 40
      ]}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
}

const styles = StyleSheet.create({
  inputText: {
    borderRadius: 10,
    backgroundColor: Colors.light.main,
    paddingHorizontal: 20,
    color: Colors.primary.main,
    fontSize: 16,
    borderColor: Colors.primary.main,
    borderWidth: 1,
    textAlignVertical: "top", // Đảm bảo nội dung bắt đầu từ trên cùng
  },
});
