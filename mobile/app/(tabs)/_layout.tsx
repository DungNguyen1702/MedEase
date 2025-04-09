import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

import { Colors } from "@/constants/Colors";

export default function TabLayout() {

  const isFocusedImage = () => {
    return {
      width: 38,
      height: 38,
      tintColor: Colors.light.main,
      marginBottom: 5,
    };
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.main,
        tabBarInactiveTintColor: Colors.light.main,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.primary.main,
          height: 70,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: 10,
          paddingTop: 15,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: Colors.primary.main,
                      borderRadius: "50%",
                      borderWidth: 2,
                      borderColor: Colors.light.main,
                      padding: 10,
                      position: "absolute",
                      bottom: 0,
                    }
                  : {}
              }
            >
              <Image
                source={require("@/assets/icons/home.png")}
                style={isFocusedImage()}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: Colors.primary.main,
                      borderRadius: "50%",
                      borderWidth: 2,
                      borderColor: Colors.light.main,
                      padding: 10,
                      position: "absolute",
                      bottom: 0,
                    }
                  : {}
              }
            >
              <Image
                source={require("@/assets/icons/schedule.png")}
                style={isFocusedImage()}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: Colors.primary.main,
                      borderRadius: "50%",
                      borderWidth: 2,
                      borderColor: Colors.light.main,
                      padding: 10,
                      position: "absolute",
                      bottom: 0,
                    }
                  : {}
              }
            >
              <Image
                source={require("@/assets/icons/notification.png")}
                style={isFocusedImage()}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: Colors.primary.main,
                      borderRadius: "50%",
                      borderWidth: 2,
                      borderColor: Colors.light.main,
                      padding: 10,
                      position: "absolute",
                      bottom: 0,
                    }
                  : {}
              }
            >
              <Image
                source={require("@/assets/icons/user.png")}
                style={isFocusedImage()}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
