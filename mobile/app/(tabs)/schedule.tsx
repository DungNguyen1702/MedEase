import InputComponent from "@/components/InputComponent";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ButtonComponent from "@/components/ButtonComponent";
import PredictedDiseaseComponent from "@/components/PredictedDiseaseComponent";
import ScheduleSpecializationComponent from "@/components/ScheduleSpecializationComponent";
import FakeData from "../../data/fake_data.json";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  AppointmentType,
  OrderPaymentMethod,
  type AppointmentTypeFee,
  type DoctorPosition,
} from "@/constants/Constants";
import { SelectList } from "react-native-dropdown-select-list";
import { FormatNumberWithDots } from "@/utils/string.utils";
import { calculateFee } from "@/utils/free-calculate.utils";
import { useRouter } from "expo-router";

const getKeyFromValue = (value: string): string | undefined => {
  const entry = Object.entries(AppointmentType).find(
    ([key, val]) => val === value
  );
  return entry ? entry[0] : undefined; // Trả về key nếu tìm thấy, ngược lại trả về undefined
};

const calculateSumFee = (
  selectedSpecs: any[],
  appointmentType: string
): number => {
  let totalFee = 0;
  selectedSpecs.forEach((spec) => {
    const basePrice = spec.spec.base_price;
    const doctorPosition = spec.doctor.position;
    const appointmentTypeKey = getKeyFromValue(appointmentType);
    if (appointmentTypeKey) {
      const fee = calculateFee(
        basePrice,
        doctorPosition,
        appointmentTypeKey as keyof typeof AppointmentTypeFee
      );
      totalFee += fee;
    }
  });
  return totalFee;
};

export default function ScheduleScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [symptoms, setSymptoms] = useState("");
  const [PredictedDiseases, setPredictedDiseases] = useState([
    {
      name: "Bệnh sốt xuất huyết",
      probability: "80%",
    },
    {
      name: "Bệnh sốt rét",
      probability: "70%",
    },
  ]);

  const specializations = FakeData.specializations;
  const doctors = FakeData.doctors.map((doctor: any) => ({
    ...doctor,
    position: doctor.position as keyof typeof DoctorPosition,
  }));

  const appointmentTypeOptions = Object.entries(AppointmentType).map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  const [showTime, setShowTime] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState([
    {
      spec: {
        _id: specializations[0]._id,
        name: specializations[0].name,
        base_price: specializations[0].base_price,
      },
      doctor: {
        _id: doctors[0]._id,
        name: doctors[0].name,
        position: doctors[0].position,
      },
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState(OrderPaymentMethod.momo);
  const [appointmentType, setAppointmentType] = useState(
    AppointmentType.general_consultation
  );

  const onChangeTitle = (text: string) => {
    setTitle(text);
  };

  const onChangeSymptoms = (text: string) => {
    setSymptoms(text);
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    setShowDate(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onClickPlusSpecialization = () => {
    setSelectedSpecs([
      ...selectedSpecs,
      {
        spec: {
          _id: specializations[0]._id,
          name: specializations[0].name,
          base_price: specializations[0].base_price,
        },
        doctor: {
          _id: doctors[0]._id,
          name: doctors[0].name,
          position: doctors[0].position,
        },
      },
    ]);
  };

  const onClickDeleteSpecialization = (index: number) => {
    const newSpecs = [...selectedSpecs];
    newSpecs.splice(index, 1);
    setSelectedSpecs(newSpecs);
  };

  const onClickPayment = () => {
    // Handle payment logic here
    // console.log("Payment clicked");
    router.push("/booking-success");
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 90,
        marginTop: 20,
        backgroundColor: Colors.light.main,
      }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <StatusBar
          backgroundColor={Colors.light.main}
          barStyle="dark-content"
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Tạo lịch hẹn</Text>
        </View>

        {/* Tiêu đề */}
        <View style={styles.bodyRowContainer}>
          <Text style={styles.bodyTitle}>Tiêu đề</Text>
          <View style={styles.textInputContainer}>
            <InputComponent
              value={title}
              placeholder="Nhập tiêu đề"
              onChangeText={onChangeTitle}
              style={styles.inputText}
            />
          </View>
        </View>

        {/* Ngày khám */}
        <View style={styles.bodyRowContainer}>
          <Text style={styles.bodyTitle}>Ngày khám</Text>
          <TouchableOpacity
            onPress={() => setShowDate(true)}
            style={styles.textInputContainer}
          >
            <TextInput
              style={styles.inputText}
              value={date.toLocaleDateString()} // Hiển thị ngày đã chọn
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
          {Platform.OS === "ios" && showDate && (
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

        {/* Thời gian */}
        <View style={styles.bodyRowContainer}>
          <Text style={styles.bodyTitle}>Thời gian</Text>
          <TouchableOpacity
            onPress={() => setShowTime(true)}
            style={styles.textInputContainer}
          >
            <TextInput
              style={styles.inputText}
              value={time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              placeholder="Chọn giờ"
              editable={false}
            />
            <Image
              source={require("@/assets/icons/select_clock.png")}
              resizeMode="contain"
              style={styles.selectIcon}
            />
          </TouchableOpacity>
          {Platform.OS === "ios" && showTime && (
            <Modal transparent={true} animationType="slide">
              <View style={styles.modalContainer}>
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={(event, selectedTime) => {
                    setShowTime(false); // Đóng picker
                    if (selectedTime) {
                      setTime(selectedTime); // Cập nhật thời gian
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowTime(false)}
                >
                  <Text style={styles.modalCloseText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
          {Platform.OS === "android" && showTime && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                setShowTime(false); // Đóng picker
                if (selectedTime) {
                  setTime(selectedTime); // Cập nhật thời gian
                }
              }}
            />
          )}
        </View>

        {/* Thể loại */}
        <View style={styles.bodyRowContainer}>
          <Text style={styles.bodyTitle}>Thể loại</Text>
          <View style={{ width: "70%" }}>
            <SelectList
              setSelected={(val: string) => {
                setAppointmentType(
                  val as
                    | "health_checkup"
                    | "general_consultation"
                    | "specialist_consultation"
                    | "re_examination"
                ); // Cập nhật giá trị appointmentType
              }}
              data={appointmentTypeOptions}
              save="key"
              placeholder="Chọn loại cuộc hẹn"
              boxStyles={styles.typeSelectBox}
            />
          </View>
        </View>

        {/* Triệu chứng */}
        <View style={styles.bodyColContainer}>
          <View style={[styles.textInputContainer, { width: "100%" }]}>
            <Text style={styles.bodyTitle}>Triệu chứng</Text>
            <ButtonComponent
              backgroundColor={Colors.primary.main}
              title="Phân tích"
              onPress={() => {}}
              textColor={Colors.light.main}
              borderColor={Colors.primary.main}
              fontSize={14}
              style={styles.buttonAnalyze}
            />
          </View>
          <InputComponent
            value={symptoms}
            placeholder="Nhập triệu chứng"
            onChangeText={onChangeSymptoms}
            style={[styles.inputText, { marginTop: 10 }]}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Dự đoán bệnh */}
        <View>
          <View style={styles.bodyHeaderContainer}>
            <View style={styles.bodyHeaderLine}></View>
            <Text
              style={[styles.bodyTitle, { marginHorizontal: 10, fontSize: 18 }]}
            >
              Dự đoán bệnh
            </Text>
            <View style={styles.bodyHeaderLine}></View>
          </View>
          {PredictedDiseases.length > 0 ? (
            PredictedDiseases.map((disease, index) => (
              <View key={index} style={{ paddingHorizontal: 20 }}>
                <PredictedDiseaseComponent
                  index={index + 1}
                  predictedDisease={disease}
                />
              </View>
            ))
          ) : (
            <View style={styles.bodyNoDiseaseContainer}>
              <Image
                source={require("@/assets/images/no-disease.png")}
                resizeMode="contain"
                style={{ width: 100, height: 100 }}
              />
              <Text style={[styles.bodyTitle, { fontWeight: "400" }]}>
                Không có dữ liệu dự đoán
              </Text>
            </View>
          )}
        </View>

        {/* Khoa cần khám */}
        <View>
          <View style={styles.bodyHeaderContainer}>
            <View style={styles.bodyHeaderLine}></View>
            <Text
              style={[styles.bodyTitle, { marginHorizontal: 10, fontSize: 18 }]}
            >
              Khoa cần khám
            </Text>
            <View style={styles.bodyHeaderLine}></View>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            {selectedSpecs.map((spec, index) => (
              <ScheduleSpecializationComponent
                key={index}
                index={index + 1}
                specialization={spec.spec}
                doctor={spec.doctor}
                specializations={specializations}
                doctors={doctors}
                onChangeSpecialization={(specialization: any) => {
                  const newSpecs = [...selectedSpecs];
                  newSpecs[index].spec = specialization;
                  setSelectedSpecs(newSpecs);
                }}
                onChangeDoctor={(doctor: any) => {
                  const newSpecs = [...selectedSpecs];
                  newSpecs[index].doctor = doctor;
                  setSelectedSpecs(newSpecs);
                }}
                onClickDeleteSpecialization={onClickDeleteSpecialization}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={onClickPlusSpecialization}
            style={styles.plusSpecializationContainer}
          >
            <Image
              source={require("@/assets/icons/plus-blue.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20, tintColor: Colors.primary.main }}
            />
            <Text style={styles.plusSpecText}>Thêm khoa</Text>
          </TouchableOpacity>
        </View>

        {/* Thanh toán */}
        <View>
          {/* Header title  */}
          <View style={styles.bodyHeaderContainer}>
            <View style={styles.bodyHeaderLine}></View>
            <Text
              style={[styles.bodyTitle, { marginHorizontal: 10, fontSize: 18 }]}
            >
              Thanh toán
            </Text>
            <View style={styles.bodyHeaderLine}></View>
          </View>

          {/* Body */}
          <View style={styles.bodyPaymentContainer}>
            <Text style={styles.bodyPaymentTitle}>
              Chọn phương thức thanh toán
            </Text>

            {/* Select payment method */}
            <View style={styles.bodyPaymentMethodContainer}>
              <TouchableOpacity
                style={[
                  styles.bodyPaymentMethod,
                  paymentMethod === OrderPaymentMethod.momo
                    ? {
                        backgroundColor: Colors.brand.momo,
                        borderColor: Colors.brand.momo,
                        borderWidth: 1,
                      }
                    : {
                        borderColor: Colors.brand.momo,
                      },
                ]}
                onPress={() => setPaymentMethod(OrderPaymentMethod.momo)}
              >
                <Image
                  source={require("@/assets/icons/logo-momo.png")}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
                <Text
                  style={[
                    styles.bodyLogoMethodText,
                    {
                      color:
                        paymentMethod === OrderPaymentMethod.momo
                          ? Colors.light.main
                          : Colors.brand.momo,
                    },
                  ]}
                >
                  Momo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.bodyPaymentMethod,
                  paymentMethod === OrderPaymentMethod.zalopay
                    ? {
                        backgroundColor: Colors.brand.zalopay_blue,
                        borderColor: Colors.brand.zalopay_blue,
                        borderWidth: 1,
                      }
                    : {
                        borderColor: Colors.brand.zalopay_blue,
                      },
                ]}
                onPress={() => setPaymentMethod(OrderPaymentMethod.zalopay)}
              >
                <Image
                  source={require("@/assets/icons/logo-zalopay.png")}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
                <Text style={styles.bodyLogoMethodText}>
                  <Text
                    style={{
                      color:
                        paymentMethod === OrderPaymentMethod.zalopay
                          ? Colors.light.main
                          : Colors.brand.zalopay_blue,
                    }}
                  >
                    Zalo
                  </Text>
                  <Text
                    style={{
                      color:
                        paymentMethod === OrderPaymentMethod.zalopay
                          ? Colors.light.main
                          : Colors.brand.zalopay_green,
                    }}
                  >
                    Pay
                  </Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.bodyPaymentMethod,
                  paymentMethod === OrderPaymentMethod.cash
                    ? {
                        backgroundColor: Colors.brand.cash,
                        borderColor: Colors.brand.cash,
                        borderWidth: 1,
                      }
                    : {
                        borderColor: Colors.brand.cash,
                      },
                ]}
                onPress={() => setPaymentMethod(OrderPaymentMethod.cash)}
              >
                <Image
                  source={require("@/assets/icons/logo-cash.png")}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
                <Text
                  style={[
                    styles.bodyLogoMethodText,
                    {
                      color:
                        paymentMethod === OrderPaymentMethod.cash
                          ? Colors.light.main
                          : Colors.brand.cash,
                    },
                  ]}
                >
                  Tiền mặt
                </Text>
              </TouchableOpacity>
            </View>

            {/* payment fee */}
            <View>
              {/* Title  */}
              <View style={styles.paymentTableContainer}>
                <Text style={[styles.paymentNumber, styles.paymentTitle]}>
                  STT
                </Text>
                <Text style={[styles.paymentSpec, styles.paymentTitle]}>
                  Khoa
                </Text>
                <Text style={[styles.paymentFee, styles.paymentTitle]}>
                  Giá tiền
                </Text>
                {/* Body  */}
              </View>
              {selectedSpecs.map((spec, index) => (
                <View key={index} style={styles.paymentTableContainer}>
                  <Text style={[styles.paymentNumber]}>{index + 1}</Text>
                  <Text style={[styles.paymentSpec]}>{spec.spec.name}</Text>
                  <Text style={[styles.paymentFee]}>
                    {FormatNumberWithDots(
                      calculateFee(
                        spec.spec.base_price,
                        spec.doctor.position,
                        getKeyFromValue(
                          appointmentType
                        ) as keyof typeof AppointmentTypeFee
                      )
                    )}{" "}
                    VND
                  </Text>
                </View>
              ))}
            </View>
          </View>
          {/* footer  */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerTitle}>
              Tổng tiền :{" "}
              {FormatNumberWithDots(
                calculateSumFee(selectedSpecs, appointmentType)
              )}{" "}
              VND
            </Text>
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={onClickPayment}
            >
              <Text style={styles.footerButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
  },
  headerContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: Colors.light.main,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: Colors.primary.main,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  bodyRowContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyColContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: "space-between",
  },
  inputText: {
    height: 50,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.light.main,
    paddingHorizontal: 20,
    color: Colors.primary.main,
    fontSize: 16,
  },
  bodyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  textInputContainer: {
    width: "70%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: Colors.primary.main,
  },
  buttonAnalyze: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  bodyHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  bodyHeaderLine: {
    width: "30%",
    height: 1,
    backgroundColor: Colors.primary.main,
    marginVertical: 10,
  },
  bodyNoDiseaseContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  plusSpecializationContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.primary.lightBackground,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  plusSpecText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginLeft: 10,
  },
  bodyPaymentContainer: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  bodyPaymentMethodContainer: {
    width: "100%",
    marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  bodyPaymentMethod: {
    width: "30%",
    height: 50,
    backgroundColor: Colors.light.main,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  bodyPaymentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  bodyLogoMethodText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  typeSelectBox: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    borderRadius: 10,
    backgroundColor: Colors.light.main,
    padding: 10,
    paddingHorizontal: 20,
    color: Colors.primary.main,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.primary.main,
    borderRadius: 10,
  },
  modalCloseText: {
    color: Colors.light.main,
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentTableContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: Colors.primary.main,
    paddingBottom: 10,
    marginTop: 10,
  },
  paymentNumber: {
    fontSize: 16,
    width: "15%",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  paymentSpec: {
    fontSize: 16,
    width: "45%",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.primary.main,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  paymentFee: {
    fontSize: 16,
    width: "40%",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  paymentTitle: {
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  footerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginBottom: 10,
  },
  paymentButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary.main,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary.main,
    color: Colors.light.main,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.main,
  },
});
