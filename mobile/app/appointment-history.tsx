import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import AppointmentHistoryComponent from "@/components/AppointmentHistoryComponent";
import { Colors } from "@/constants/Colors";
import InputComponent from "@/components/InputComponent";
import FakeData from "@/data/fake_data.json";

type Appointment = {
  _id: string;
  patient_id: string;
  title: string;
  status: string;
  appointment_date: string;
  start_time: string;
  symptoms: string;
  predicted_disease: { name: string; percent: number };
  number: number;
  paymentMethod: string;
  reasonCancel: string | null;
  isPaid: boolean;
  price: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export default function AppointmentHistory() {
  const appointments: Appointment[] = FakeData.appointments;

  const [search, setSearch] = useState("");
  const [filteredAppointments, setFilteredAppointments] =
    useState<Appointment[]>(appointments);

  useEffect(() => {
    // Filter appointments based on search input
    const filteredAppointments = appointments.filter((appointment) =>
      appointment.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAppointments(filteredAppointments);
  }, [search]);

  return (
    <View style={styles.container}>
      <InputComponent
        placeholder="Tìm kiếm lịch khám bệnh"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredAppointments.map((appointment, index) =>
          "number" in appointment && "title" in appointment ? (
            <AppointmentHistoryComponent
              id={appointment._id}
              key={index}
              number={String(appointment.number)}
              title={appointment.title}
              time={appointment.start_time}
              date={appointment.appointment_date}
              symptoms={appointment.symptoms}
              status={
                ["done", "wait", "cancel"].includes(appointment.status)
                  ? (appointment.status as "done" | "wait" | "cancel")
                  : "cancel"
              }
            />
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    marginBottom: 20,
    paddingVertical: 10,
  },
});
