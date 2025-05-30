import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import Slider from "@/components/SliderComponent";
import ButtonComponent from "@/components/ButtonComponent";
import ScheduleComponent from "@/components/ScheduleComponent";
import SpecializationComponent from "@/components/SpecializationComponent";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SpecAPI } from "@/api/spec";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { AppointmentDetailAPI } from "@/api/appointment-detail";

export default function HomeScreen() {
  const router = useRouter();

  const account = useSelector((state: RootState) => state.auth.account);

  const [appoinmentDetail, setAppointmentDetail] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const callAPI = async () => {
    try {
      const specResponse = await SpecAPI.getAllSpec();

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const appointmentDetailResponse =
        await AppointmentDetailAPI.getAppointmentDetailByDate(formattedDate);
      setSpecializations(specResponse);
      setAppointmentDetail(appointmentDetailResponse);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const onPressSeeAll = () => {
    router.push("/list-appointment");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: account.avatar }}
          resizeMode="cover"
          style={styles.userAvatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerAccountNameText}>
            Xin chào, {account.name}
          </Text>
          <Text style={styles.headerBottomText}>
            Chúc bạn có một ngày tốt lành
          </Text>
        </View>
      </View>

      {/* Slide */}
      <View style={styles.SliderContainer}>
        <Slider />
      </View>

      {/* Body 1 */}
      <View style={styles.bodyContainer}>
        <View style={styles.bodyHeaderContainer}>
          <Text style={styles.bodyHeaderText}>
            Lịch hẹn của bạn trong hôm nay
          </Text>
          <View>
            <ButtonComponent
              title="Xem tất cả"
              onPress={onPressSeeAll}
              backgroundColor={Colors.primary.main}
              textColor="#fff"
              fontSize={13}
            />
          </View>
        </View>
        <View style={styles.body1Container}>
          {appoinmentDetail && appoinmentDetail.length !== 0 ? (
            appoinmentDetail.map((item, index) => {
              return (
                <View style={{ marginBottom: 10 }} key={index}>
                  <ScheduleComponent data={item} />
                </View>
              );
            })
          ) : (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("@/assets/icons/no-calendar.png")}
                resizeMode="contain"
                style={styles.noDataImage}
              />
              <Text style={styles.noDataText}>
                Không có lịch hẹn nào trong hôm nay
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Body 2 */}
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyHeaderText}>Khoa trong bệnh viện</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          {specializations.map((item, index) => {
            return (
              <View key={index} style={{ marginRight: 10 }}>
                <SpecializationComponent data={item} />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  headerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.primary.main,
    marginTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  headerAccountNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  headerBottomText: {
    fontSize: 15,
    color: Colors.primary.main,
  },
  SliderContainer: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
  bodyHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  bodyHeaderText: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  body1Container: {
    backgroundColor: Colors.primary.lightBackground,
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  bodyContainer: {
    paddingHorizontal: 20,
  },
  noDataImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    textAlign: "center",
    marginTop: 10,
  },
});
