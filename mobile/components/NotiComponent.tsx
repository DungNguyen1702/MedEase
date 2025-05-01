import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { notifiAPI } from "@/api/notification";

export default function NotiComponent(props: any) {
  const { noti, onUpdateNotis } = props;

  const handlePress = async () => {
    try {
      const response = await notifiAPI.readNoti(noti._id);
      console.log("response", response);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    onUpdateNotis({ status: true }, noti._id);
  };

  return (
    <TouchableOpacity
      style={
        !noti.status
          ? [styles.container, styles.notReadContainer]
          : styles.container
      }
      onPress={handlePress}
    >
      <Image
        source={{ uri: noti.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{noti.title}</Text>
        <Text style={styles.content}>{noti.content}</Text>
      </View>
      <Text style={styles.createdAt}>{noti.createdAt}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: Colors.light.main,
    paddingVertical: 20,
  },
  notReadContainer: {
    backgroundColor: Colors.primary.lightBackground,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    color: "#666",
  },
  createdAt: {
    fontSize: 12,
    color: "#999",
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});
