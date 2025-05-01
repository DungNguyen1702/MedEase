import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import InputComponent from "@/components/InputComponent";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScheduleComponent from "@/components/ScheduleComponent";
import { useRouter } from "expo-router";
import { AppointmentDetailAPI } from "@/api/appointment-detail";
import { formatDateToYYYYMMDD } from "@/utils/string.utils";

export default function ListAppointment() {
  const router = useRouter();

  interface AppointmentDetail {
    address: string;
    doctor: { name: string };
    specialization: { name: string };
  }

  const [appoinmentDetail, setAppointmentDetail] = useState<
    AppointmentDetail[]
  >([]);

  const [filterAppoinmentDetail, setFilterAppointmentDetail] =
    useState(appoinmentDetail);

  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");

  const callAPI = async () => {
    try {
      console.log(formatDateToYYYYMMDD(date.toISOString().split("T")[0]));
      const response = await AppointmentDetailAPI.getAppointmentDetailByDate(
        formatDateToYYYYMMDD(date.toISOString().split("T")[0])
      );
      console.log(response);
      setAppointmentDetail(response);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, [date]);

  useEffect(() => {
    setFilterAppointmentDetail(appoinmentDetail);
  }, [appoinmentDetail]);

  const onPressAddAppointment = () => {
    router.push("/(tabs)/schedule");
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    setShowDate(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeText = (text: string) => {
    setSearch(text);
    if (text.length === 0) {
      setFilterAppointmentDetail(appoinmentDetail);
    }
    const filteredData = appoinmentDetail.filter(
      (item) =>
        item.address.toLowerCase().includes(text.toLowerCase()) ||
        item.doctor.name.toLowerCase().includes(text.toLowerCase()) ||
        item.specialization.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterAppointmentDetail(filteredData);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primary.main}
        barStyle="light-content"
      />

      {/* header */}
      <View style={styles.header}>
        {/* search */}
        <InputComponent
          placeholder="Tìm kiếm lịch hẹn"
          value={search}
          onChangeText={onChangeText}
          multiline={false}
          numberOfLines={1}
          style={{ backgroundColor: Colors.light.main, width: 180 }}
        />

        {/* date picker */}
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            onPress={() => setShowDate(true)}
            style={styles.textInputContainer}
          >
            <TextInput
              style={styles.inputText}
              value={date.toLocaleDateString()}
              placeholder="Chọn ngày"
              editable={false}
            />
            <Image
              source={require("@/assets/icons/select_calendar.png")}
              resizeMode="contain"
              style={styles.selectIcon}
            />
          </TouchableOpacity>
          {showDate && (
            <Modal transparent={true} animationType="slide">
              <View style={styles.modalContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onChangeDate}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowDate(false)}
                >
                  <Text style={styles.modalCloseText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
        </View>

        {/* add appointment */}
        <TouchableOpacity onPress={onPressAddAppointment} style={styles.button}>
          <Image
            source={require("@/assets/icons/plus-white.png")}
            style={styles.addButtonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={{ padding: 20 }}>
        {filterAppoinmentDetail.length !== 0 ? (
          filterAppoinmentDetail.map((item, index) => {
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: Colors.primary.main,
    padding: 10,
    borderRadius: 5,
  },
  addButtonIcon: {
    width: 24,
    height: 24,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.main,
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  inputText: {
    fontSize: 16,
    color: Colors.primary.main,
    borderColor: Colors.primary.main,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  selectIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCloseButton: {
    backgroundColor: Colors.primary.main,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  modalCloseText: {
    color: Colors.light.main,
    fontSize: 16,
  },
  textInput: {
    backgroundColor: Colors.light.main,
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textInputIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
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
