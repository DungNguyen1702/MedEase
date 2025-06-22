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
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ButtonComponent from "@/components/ButtonComponent";
import PredictedDiseaseComponent from "@/components/PredictedDiseaseComponent";
import ScheduleSpecializationComponent from "@/components/ScheduleSpecializationComponent";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  AppointmentType,
  OrderPaymentMethod,
  type AppointmentTypeFee,
  type DoctorPosition,
} from "@/constants/Constants";
import { SelectList } from "react-native-dropdown-select-list";
import {
  formatDateToYYYYMMDD,
  FormatNumberWithDots,
  getKeyFromValue,
} from "@/utils/string.utils";
import { calculateFee, calculateSumFee } from "@/utils/free-calculate.utils";
import { useRouter } from "expo-router";
import { SpecAPI } from "@/api/spec";
import { useSearchParams } from "expo-router/build/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AppointmentAPI } from "@/api/appointment";
import { predictDiseaseAPI } from "@/api/predict_disease";

interface DoctorInterface {
  _id: string;
  account: any;
  position: keyof typeof DoctorPosition;
}

export default function ScheduleScreen() {
  const router = useRouter();
  const account = useSelector((state: RootState) => state.auth.account);

  const searchParams = useSearchParams();
  const reExamId = searchParams.get("reExamId");
  const doctorId = searchParams.get("doctorId");
  const specilizationId = searchParams.get("specilizationId");
  const appointmentId = searchParams.get("appointmentId");
  const reExamDate = searchParams.get("reExamDate");

  const [title, setTitle] = useState("Khám sức khỏe");
  // const [time, setTime] = useState(new Date());
  const [time, setTime] = useState(() => {
    const defaultTime = new Date();
    defaultTime.setHours(10, 0, 0, 0); // Đặt giờ là 10:00:00.000
    return defaultTime;
  });
  // const [date, setDate] = useState(
  //   reExamDate ? new Date(reExamDate) : new Date()
  // );
  const [date, setDate] = useState(
    reExamDate ? new Date(reExamDate) : new Date("2025-06-21")
  );
  const [symptoms, setSymptoms] = useState("Người bệnh thường ho khan kéo dài, đặc biệt là vào ban đêm hoặc sáng sớm. Có những cơn khó thở, cảm giác nặng ngực, thở rít khi thở ra. Đôi khi xuất hiện sau khi tiếp xúc với dị nguyên như bụi, lông thú hoặc thay đổi thời tiết.");
  const [PredictedDiseases, setPredictedDiseases] = useState([]);

  const [specializations, setSpecializations] = useState<
    {
      _id: string;
      name: string;
      base_price: number;
      doctors: DoctorInterface[];
    }[]
  >([]);

  const appointmentTypeOptions = Object.entries(AppointmentType).map(
    ([key, value]) => ({
      key,
      value,
      disabled: key === "re_examination" && !reExamId,
    })
  );

  const [showTime, setShowTime] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<
    {
      spec: { _id: string; name: string; base_price: number };
      doctor: {
        _id: string;
        name: string;
        position: keyof typeof DoctorPosition;
      };
    }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState(OrderPaymentMethod.momo);
  const [appointmentType, setAppointmentType] = useState<
    keyof typeof AppointmentType
  >("general_consultation");

  const callAPI = async () => {
    try {
      const reponseSpec = await SpecAPI.getAllSpec();
      setSpecializations(reponseSpec);
      if (specilizationId) {
        const selectedSpec = reponseSpec.find(
          (spec: any) => spec._id === specilizationId
        );
        if (selectedSpec) {
          const selectedDoctor = selectedSpec.doctors.find(
            (doctor: any) => doctor._id === doctorId
          );
          if (selectedDoctor) {
            setSelectedSpecs([
              {
                spec: {
                  _id: selectedSpec._id,
                  name: selectedSpec.name,
                  base_price: selectedSpec.base_price,
                },
                doctor: {
                  _id: selectedDoctor._id,
                  name: selectedDoctor.account.name,
                  position: selectedDoctor.position,
                },
              },
            ]);
          }
        }
      } else {
        setSelectedSpecs([
          {
            spec: {
              _id: reponseSpec[0]._id,
              name: reponseSpec[0].name,
              base_price: reponseSpec[0].base_price,
            },
            doctor: {
              _id: reponseSpec[0].doctors[0]._id,
              name: reponseSpec[0].doctors[0].account.name,
              position: reponseSpec[0].doctors[0].position,
            },
          },
        ]);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    if (reExamId) {
      setAppointmentType("re_examination");
    }
    // console.log("Re exam id ", reExamId);
  }, [reExamId]);

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
          _id: specializations[0].doctors[0]._id,
          name: specializations[0].doctors[0].account.name,
          position: specializations[0].doctors[0].position,
        },
      },
    ]);
  };

  const onClickDeleteSpecialization = (index: number) => {
    const newSpecs = [...selectedSpecs];
    newSpecs.splice(index, 1);
    setSelectedSpecs(newSpecs);
  };

  const onClickPayment = async () => {
    // validate data
    if (title === "") {
      Alert.alert("Thông báo", "Vui lòng nhập tiêu đề");
      return;
    }
    if (date < new Date()) {
      Alert.alert("Thông báo", "Vui lòng chọn ngày khám hợp lệ");
      return;
    }
    if (
      time.getHours() < 8 ||
      (time.getHours() >= 12 && time.getHours() < 13) ||
      time.getHours() >= 17
    ) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn thời gian khám trong giờ hành chính (8h-12h hoặc 13h-17h)"
      );
      return;
    }
    if (selectedSpecs.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn khoa khám");
      return;
    }
    if (selectedSpecs.some((spec) => spec.doctor === undefined)) {
      Alert.alert("Thông báo", "Vui lòng chọn bác sĩ");
      return;
    }
    if (selectedSpecs.some((spec) => spec.spec === undefined)) {
      Alert.alert("Thông báo", "Vui lòng chọn chuyên khoa");
      return;
    }
    if (symptoms === "") {
      Alert.alert("Thông báo", "Vui lòng nhập triệu chứng");
      return;
    }

    const createAppointment: {
      title: string;
      appointment_date: string;
      time: string;
      type:
        | "general_consultation"
        | "specialist_consultation"
        | "re_examination"
        | "health_checkup";
      symptoms: string;
      predicted_disease: never[];
      appointment_detail: {
        specialization_id: string;
        doctor_id: string;
        price: number;
      }[];
      totalPrice: number;
      createdBy: any;
      paymentMethod: string | undefined;
      re_exam_id?: string;
    } = {
      title,
      appointment_date: formatDateToYYYYMMDD(date.toISOString()),
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: appointmentType,
      symptoms,
      predicted_disease: PredictedDiseases,
      appointment_detail: selectedSpecs.map((spec) => ({
        specialization_id: spec.spec._id,
        doctor_id: spec.doctor._id,
        price: calculateFee(
          spec.spec.base_price,
          spec.doctor.position,
          appointmentType
        ),
      })),
      totalPrice: calculateSumFee(selectedSpecs, appointmentType),
      createdBy: account.name,
      paymentMethod: getKeyFromValue(OrderPaymentMethod, paymentMethod),
    };

    if (reExamId) {
      createAppointment.re_exam_id = reExamId;
    }

    // console.log("Create appointment", createAppointment);
    try {
      if (paymentMethod === OrderPaymentMethod.momo) {
        console.log(
          "---------------------------Momo payment---------------------------"
        );
        console.log("input : ", {
          ...createAppointment,
          rootRedirectUrl: process.env.EXPO_PUBLIC_API_ROOT_REDIRECT_URL,
        });

        const response = await AppointmentAPI.createAppoinetmentMomo({
          ...createAppointment,
          rootRedirectUrl: process.env.EXPO_PUBLIC_API_ROOT_REDIRECT_URL,
        });

        console.log(response);
        router.push({
          pathname: "/booking-success",
          params: {
            paymentCode: response.requestId,
            paymentMethod: getKeyFromValue(OrderPaymentMethod, paymentMethod),
            paymentLink: response.payUrl,
          },
        });
      } else if (paymentMethod === OrderPaymentMethod.zalopay) {
        console.log(
          "---------------------------Zalppay payment---------------------------"
        );
        const response = await AppointmentAPI.createAppoinetmentZalo({
          ...createAppointment,
          rootRedirectUrl: process.env.EXPO_PUBLIC_API_ROOT_REDIRECT_URL,
        });
        console.log(response);
        router.push({
          pathname: "/booking-success",
          params: {
            paymentCode: response.app_trans_id,
            paymentMethod: getKeyFromValue(OrderPaymentMethod, paymentMethod),
            paymentLink: response.order_url,
          },
        });
      } else if (paymentMethod === OrderPaymentMethod.cash) {
        console.log(
          "---------------------------Cash payment---------------------------"
        );
        const response = await AppointmentAPI.createAppointment(
          createAppointment
        );
        console.log("Response create appointment", response);
        router.push({
          pathname: "/booking-success",
          params: {
            appointment_id: response._id,
          },
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      Alert.alert(
        "Thông báo",
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."
      );
    }
  };

  const updateSpec = (
    index: number,
    updatedValues: Partial<(typeof selectedSpecs)[0]>
  ) => {
    const newSpecs = [...selectedSpecs];
    newSpecs[index] = { ...newSpecs[index], ...updatedValues }; // Cập nhật giá trị
    setSelectedSpecs(newSpecs);
  };

  const onPredictedDisease = async () => {
    if (symptoms === "") {
      Alert.alert("Thông báo", "Vui lòng nhập triệu chứng");
      return;
    }

    try {
      const response = await predictDiseaseAPI.getPredictDisease(symptoms);

      setPredictedDiseases(response.results.slice(0, 5));

      // Nếu có kết quả dự đoán
      if (response.results.length > 0) {
        // Lấy chuyên khoa từ kết quả đầu tiên
        const firstDisease = response.results[0];
        console.log("First predicted disease:", firstDisease);

        const recommendedSpecializations =
          firstDisease.specialization.split(", "); // ["Khoa Thần kinh", "Khoa Tai mũi họng"]
        console.log("Recommended specializations:", recommendedSpecializations);

        // Tìm các chuyên khoa phù hợp trong danh sách specializations
        const matchedSpecs = specializations.filter((spec) =>
          recommendedSpecializations.some((recSpec: any) =>
            spec.name.includes(recSpec)
          )
        );

        console.log("Matched specializations:", matchedSpecs);

        if (matchedSpecs.length > 0) {
          // Tạo mảng selectedSpecs mới với bác sĩ đầu tiên của mỗi chuyên khoa
          const newSelectedSpecs = matchedSpecs.map((spec) => ({
            spec: {
              _id: spec._id,
              name: spec.name,
              base_price: spec.base_price,
            },
            doctor: {
              _id: spec.doctors[0]._id,
              name: spec.doctors[0].account.name,
              position: spec.doctors[0].position,
            },
          }));

          console.log("New selected specs:", newSelectedSpecs);

          // Cập nhật state
          setSelectedSpecs(newSelectedSpecs);
        } else {
          console.log("Không tìm thấy chuyên khoa phù hợp");
        }
      }
    } catch (error: any) {
      console.log("Error fetching data:", error);
      Alert.alert(
        "Thông báo",
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."
      );
    }
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
                  onChange={(event: any, selectedTime: any) => {
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
              onChange={(event: any, selectedTime: any) => {
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
              defaultOption={{
                key: appointmentType, // Key là giá trị hiện tại của appointmentType
                value:
                  AppointmentType[
                    appointmentType as keyof typeof AppointmentType
                  ],
              }}
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
              onPress={onPredictedDisease}
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
                spec={spec}
                specializations={specializations}
                updateSpec={updateSpec}
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
                        appointmentType
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
