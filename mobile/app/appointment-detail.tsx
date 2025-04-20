import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import FakeData from "@/data/fake_data.json";
import {
  AppointmentStatus,
  AppointmentType,
  OrderPaymentMethod,
  type AppointmentTypeFee,
  type DoctorPosition,
} from "@/constants/Constants";
import InputComponent from "@/components/InputComponent";
import PredictedDiseaseComponent from "@/components/PredictedDiseaseComponent";
import MedicalRecordComponent from "@/components/MedicalRecordComponent";
import AppointmentDetailComponent from "@/components/AppointmentDetailComponent";
import { FormatNumberWithDots, getKeyFromValue } from "@/utils/string.utils";
import { calculateFee, calculateSumFee } from "@/utils/free-calculate.utils";
import { Colors } from "@/constants/Colors";

export default function AppointmentDetail() {
  const appointment: {
    status: keyof typeof AppointmentStatus;
    type: keyof typeof AppointmentType;
    [key: string]: any;
  } = {
    ...FakeData.appointments[0],
    status: FakeData.appointments[0].status as keyof typeof AppointmentStatus,
    type: FakeData.appointments[0].type as keyof typeof AppointmentType,
  };

  const [selectedSpecs, setSelectedSpecs] = useState<
    {
      spec: { _id: string; name: string; base_price: number };
      doctor: { _id: string; name: string; position: string };
    }[]
  >([]);

  useEffect(() => {
    const filteredSpecs = appointment.appointment_detail.map((item: any) => {
      return {
        spec: item.specialization,
        doctor: item.doctor,
      };
    });
    setSelectedSpecs(filteredSpecs);
  }, [appointment.appointment_detail]);

  return (
    <ScrollView style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <View style={{ width: "100%" }}>
          <Text>
            <Text style={[styles.itemTitle, { color: Colors.light.main }]}>
              Tiêu đề :{" "}
            </Text>
            <Text style={[styles.itemValue, { color: Colors.light.main }]}>
              {appointment.title}
            </Text>
          </Text>
          <Text>
            <Text style={[styles.itemTitle, { color: Colors.light.main }]}>
              Ngày khám :{" "}
            </Text>
            <Text style={[styles.itemValue, { color: Colors.light.main }]}>
              {appointment.appointment_date}
            </Text>
          </Text>
          <Text>
            <Text style={[styles.itemTitle, { color: Colors.light.main }]}>
              Thời gian :{" "}
            </Text>
            <Text style={[styles.itemValue, { color: Colors.light.main }]}>
              {appointment.start_time}
            </Text>
          </Text>
        </View>
        <View style={styles.headerTagContainer}>
          <Text style={styles.headerTitle}>Số của bạn</Text>
          <Text style={styles.headerNum}>{appointment.number}</Text>
        </View>
      </View>

      {/* body */}
      <View style={styles.bodyContainer}>
        {/* Chi tiết lịch hẹn */}
        <View style={styles.itemGeneralContainer}>
          <View style={styles.itemTitleContainer}>
            <View style={[styles.lines, { flex: 1 }]} />
            <Text style={[styles.itemTitle, { marginHorizontal: 10 }]}>
              Chi tiết lịch hẹn
            </Text>
            <View style={[styles.lines, { flex: 1 }]} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Trạng thái lịch hẹn</Text>
            <Text style={styles.itemValue}>
              {AppointmentStatus[appointment.status]}
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Lý do hủy</Text>
            <Text style={styles.itemValue}>
              {appointment.cancel_reason
                ? appointment.cancel_reason
                : "Không có lý do hủy"}
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Thể loại</Text>
            <Text style={styles.itemValue}>
              {AppointmentType[appointment.type]}
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Ngày tạo</Text>
            <Text style={styles.itemValue}>{appointment.createdAt}</Text>
          </View>
        </View>

        {/* Chi tiết bệnh */}
        <View style={styles.itemGeneralContainer}>
          <View style={styles.itemTitleContainer}>
            <View style={[styles.lines, { flex: 1 }]} />
            <Text style={[styles.itemTitle, { marginHorizontal: 10 }]}>
              Chi tiết bệnh
            </Text>
            <View style={[styles.lines, { flex: 1 }]} />
          </View>

          <View style={styles.itemColContainer}>
            <Text style={styles.itemTitle}>Triệu chứng</Text>
            <InputComponent
              placeholder="Nhập triệu chứng"
              value={appointment.symptoms}
              editable={false}
              multiline={true}
              style={styles.inputTextArea}
            />
          </View>

          {/* Bệnh dự đoán */}
          <View style={styles.itemColContainer}>
            <Text style={styles.itemTitle}>Bệnh dự đoán</Text>
            {appointment.predicted_disease.length > 0 ? (
              appointment.predicted_disease.map((disease: any, index: any) => (
                <View key={index}>
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

          {/* Bệnh chuẩn đoán */}
          <View style={styles.itemColContainer}>
            <Text style={[styles.itemTitle, { marginBottom: 10 }]}>
              Bệnh chuẩn đoán
            </Text>
            {appointment.medical_record.length > 0 ? (
              appointment.medical_record.map((disease: any, index: any) => (
                <View key={index}>
                  <MedicalRecordComponent key={index} medicalRecord={disease} />
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
                  Không có dữ liệu chuẩn đoán
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Phòng khám */}
        <View style={[styles.itemGeneralContainer, { marginTop: -10 }]}>
          <View style={styles.itemTitleContainer}>
            <View style={[styles.lines, { flex: 1 }]} />
            <Text style={[styles.itemTitle, { marginHorizontal: 10 }]}>
              Phòng khám
            </Text>
            <View style={[styles.lines, { flex: 1 }]} />
          </View>
          {appointment.appointment_detail.map((item: any, index: any) => {
            const newItem = {
              ...item,
              appointment: appointment,
            };
            return (
              <AppointmentDetailComponent
                key={index}
                appointmentDetail={newItem}
              />
            );
          })}
        </View>

        {/* Thanh toán */}
        <View style={styles.itemGeneralContainer}>
          <View style={styles.itemTitleContainer}>
            <View style={[styles.lines, { flex: 1 }]} />
            <Text style={[styles.itemTitle, { marginHorizontal: 10 }]}>
              Thanh toán
            </Text>
            <View style={[styles.lines, { flex: 1 }]} />
          </View>

          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Phương thức</Text>
            <Text style={styles.itemValue}>
              {
                OrderPaymentMethod[
                  appointment.paymentMethod as keyof typeof OrderPaymentMethod
                ]
              }
            </Text>
          </View>

          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Tình trạng thanh toán</Text>
            <Text style={styles.itemValue}>
              {appointment.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </Text>
          </View>

          <View style={styles.itemColContainer}>
            <Text style={styles.itemTitle}>Thông tin chi tiết</Text>
          </View>

          {/* Chi tiết giá tiền */}
          <View style={styles.itemColContainer}>
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
                      spec.doctor.position as keyof typeof DoctorPosition,
                      appointment.type
                    )
                  )}{" "}
                  VND
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.itemContainer, styles.totalPrice]}>
            <Text style={styles.footerTitle}>
              Tổng tiền :{" "}
              {FormatNumberWithDots(
                calculateSumFee(
                  selectedSpecs,
                  AppointmentType[appointment.type]
                )
              )}{" "}
              VND
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: Colors.primary.main,
    alignItems: "center",
    paddingBottom: 30,
    marginBottom: 20,
  },
  headerTagContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: Colors.light.main,
    position: "absolute",
    bottom: -45,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.primary.main,
    borderWidth: 1,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary.darkText,
  },
  headerNum: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  itemGeneralContainer: {
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 10,
  },
  itemTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  itemValue: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  itemContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemColContainer: {
    marginVertical: 10,
  },
  inputTextArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.primary.lightBackground,
    marginTop: 10,
  },
  lines: {
    height: 1,
    backgroundColor: Colors.primary.main,
    marginVertical: 10,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: Colors.light.main,
    padding: 20,
  },
  bodyNoDiseaseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bodyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
  paymentTitle: {
    fontWeight: "bold",
    color: Colors.primary.main,
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
  footerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.danger.text,
    textAlign: "center",
    width: "100%",
  },
  totalPrice: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary.lightBackground,
    borderRadius: 10,
  },
  headerImage: {
    width: "100%",
    height: 150,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  tagContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    top: 125,
  },
  tag: {
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF0000",
  },
});
