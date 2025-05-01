import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Colors } from "@/constants/Colors";
import DoctorSpecComponent from "@/components/DoctorSpecComponent";
import { SpecAPI } from "@/api/spec";

export default function SpecDetail() {
  const { specializationId } = useLocalSearchParams();
  const [spec, setSpec] = useState<{
    name: string;
    description: string;
    image: string;
  } | null>();
  const [doctorNum, setDoctorNum] = useState<number>(0);
  const [doctors, setDoctors] = useState<any[]>([]);

  const callAPI = async () => {
    try {
      const responseSpec = await SpecAPI.getSpecById(
        specializationId as string
      );
      setSpec(responseSpec[0]);
      console.log("responseSpec", responseSpec[0]);
      setDoctors(responseSpec[0].doctors);
      setDoctorNum(responseSpec[0].doctors.length);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    callAPI();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primary.main}
        barStyle="light-content"
      />
      {/* header */}
      <View style={styles.header}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              <Text style={{ fontWeight: "bold" }}>Khoa : </Text>{" "}
              <Text>{spec?.name}</Text>
            </Text>
            <Text style={styles.headerTitle}>
              <Text style={{ fontWeight: "bold" }}>Số lượng bác sĩ : </Text>{" "}
              <Text>{doctorNum}</Text>
            </Text>
          </View>
          <Text style={styles.headerTitle}>
            <Text style={{ fontWeight: "bold" }}>Miêu tả : </Text>{" "}
            <Text>{spec?.description}</Text>
          </Text>
        </View>
        <View style={styles.headerImageContainer}>
          <Image
            source={{ uri: spec?.image }}
            resizeMode="cover"
            style={styles.headerImage}
          />
        </View>
      </View>

      {/* body */}
      <View style={styles.body}>
        {doctors.map((doctor: any, index: number) => (
          <View key={doctor._id || index} style={styles.bodyItemContainer}>
            <DoctorSpecComponent doctor={doctor} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
  },
  header: {
    backgroundColor: Colors.primary.main,
    paddingBottom: 70,
    width: "100%",
    paddingTop: 25,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.light.main,
    marginBottom: 10,
  },
  headerImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 110,
    left: 0,
    width: "100%",
  },
  headerImage: {
    width: 250,
    height: 150,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  body: {
    padding: 20,
    marginTop: 70,
    flexDirection: "row", // Chia các phần tử theo hàng ngang
    flexWrap: "wrap", // Cho phép các phần tử xuống dòng nếu không đủ chỗ
    justifyContent: "space-between", // Khoảng cách đều giữa các phần tử
  },
  bodyItemContainer: {
    width: "48%",
    marginBottom: 20,
  },
});
