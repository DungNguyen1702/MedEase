import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { NotificationTypeEnum } from "@/constants/Constants";
import { Colors } from "@/constants/Colors";
import NotiComponent from "@/components/NotiComponent";
import { getKeyFromValue } from "@/utils/string.utils";
import { notifiAPI } from "@/api/notification";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import socket from "@/utils/socket";

export default function NotificationPage() {
  const account = useSelector((state: RootState) => state.auth.account);

  const [notifications, setNotifications] = useState<
    { _id: string; type: string; [key: string]: any }[]
  >([]);

  const [selectedNotification, setSelectedNotification] = useState(
    NotificationTypeEnum.all
  );

  const [filterNotis, setFilterNotis] =
    useState<{ _id: string; type: string; [key: string]: any }[]>(
      notifications
    );

  const callAPI = async () => {
    try {
      const response = await notifiAPI.getNoti();
      setNotifications(response);

      // Lọc theo trạng thái đã chọn
      if (selectedNotification === NotificationTypeEnum.all) {
        setFilterNotis(response);
      } else {
        const typeKey = getKeyFromValue(
          NotificationTypeEnum,
          selectedNotification
        );
        const filtered = response.filter((noti: any) => noti.type === typeKey);
        setFilterNotis(filtered);
      }
    } catch (error: any) {
      console.log("Lỗi khi gọi API:", error.message);
    }
  };

  const consoleLog = (message: string) => {
    console.log(`🔔 [NotificationPage] ${message} `);
  };

  // useEffect chỉ nên chạy một lần hoặc khi selectedNotification thay đổi
  useEffect(() => {
    callAPI();

    socket.emit("joinRoom", account._id);

    socket.on("notification", (newNoti) => {

      setNotifications((prev) => {
        return [newNoti.data, ...prev];
      });

      const typeKey = getKeyFromValue(
        NotificationTypeEnum,
        selectedNotification
      );
      if (
        selectedNotification === NotificationTypeEnum.all ||
        newNoti.data.type === typeKey
      ) {
        setFilterNotis((prev) => [newNoti.data, ...prev]);
      }
    });

    return () => {
      socket.emit("leaveRoom", account._id);
      socket.off("notification");
    };
  }, [selectedNotification]);

  const onSelectNotiType = (type: string) => {
    console.log(type);
    setSelectedNotification(type);
    if (type === NotificationTypeEnum.all) {
      setFilterNotis(notifications);
    } else {
      const filteredNotis = notifications.filter(
        (noti) => noti.type === getKeyFromValue(NotificationTypeEnum, type)
      );
      setFilterNotis(filteredNotis);
    }
  };

  const onUpdateNotis = (newNoti: any, id: string) => {
    const newNotis = notifications.map((noti) => {
      if (noti._id === id) {
        return { ...noti, ...newNoti };
      }
      return noti;
    });
    setFilterNotis(newNotis);
    setNotifications(newNotis);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      <StatusBar
        backgroundColor={Colors.primary.main}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {(
          Object.keys(NotificationTypeEnum) as Array<
            keyof typeof NotificationTypeEnum
          >
        ).map((key) => (
          <TouchableOpacity
            key={key}
            style={
              selectedNotification === NotificationTypeEnum[key] ||
              selectedNotification === NotificationTypeEnum.all
                ? [styles.unSelectedTypeNoti, styles.selectedTypeNoti]
                : styles.unSelectedTypeNoti
            }
            onPress={() => onSelectNotiType(NotificationTypeEnum[key])}
          >
            <Text
              style={
                selectedNotification === NotificationTypeEnum[key] ||
                selectedNotification === NotificationTypeEnum.all
                  ? [styles.unSelectedText, styles.selectedText]
                  : styles.unSelectedText
              }
            >
              {NotificationTypeEnum[key]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.body}>
        {filterNotis.map((notification) => (
          <NotiComponent
            key={notification._id}
            noti={notification}
            onUpdateNotis={onUpdateNotis}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: Colors.primary.main,
    padding: 20,
    marginBottom: 20,
    paddingTop: 45,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.main,
  },
  unSelectedTypeNoti: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: Colors.primary.main,
    borderWidth: 1,
  },
  selectedTypeNoti: {
    backgroundColor: Colors.primary.main,
  },
  unSelectedText: {
    color: Colors.primary.main,
    fontWeight: "bold",
  },
  selectedText: {
    color: Colors.light.main,
  },
  body: {
    paddingVertical: 20,
  },
});
