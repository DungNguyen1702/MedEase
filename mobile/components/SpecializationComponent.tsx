import { Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { TruncateText } from "@/utils/string.utils";

const screenWidth = Dimensions.get("window").width;

export default function SpecializationComponent(props: any) {
  const { data } = props;
  const [containerWidth, setContainerWidth] = useState(0); // Lưu chiều rộng thực tế của container

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout; // Lấy chiều rộng thực tế của container
    setContainerWidth(width);
  };

  return (
    <TouchableOpacity style={styles.container} onLayout={handleLayout}>
      <View style={[styles.circle, { width: containerWidth }]}></View>
      <Image
        source={{ uri: data.image }}
        resizeMode="cover"
        style={styles.image}
      />
      <Text style={styles.name}>{TruncateText(data.name, 12)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    height: "80%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: Colors.primary.lightMain,
    top: "-10%",
    left: 0, // Căn chỉnh phù hợp
  },
  container: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.light.main,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.primary.main,
    borderWidth: 1,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    color: Colors.primary.main,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});
