import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { DoctorPosition } from "@/constants/Constants";
import { Colors } from "@/constants/Colors";

export default function ScheduleSpecializationComponent(props: any) {
  const {
    index,
    spec,
    specializations,
    updateSpec,
    onClickDeleteSpecialization,
  } = props;

  const [specialization, setSpecialization] = useState(spec.spec);

  const [doctors, setDoctors] = useState(
    specializations.find((spec: any) => spec._id === specialization?._id)
      ?.doctors
  );

  const [doctor, setDoctor] = useState(doctors[0]);

  useEffect(()=>{
    const selectedSpecialization = specializations.find(
      (spec: any) => spec._id === specialization?._id
    );
    setSpecialization(spec.spec);
    
    setDoctors(selectedSpecialization?.doctors || []);
    setDoctor(selectedSpecialization?.doctors[0] || null);
  },[spec])

  useEffect(() => {
    const selectedSpecialization = specializations.find(
      (spec: any) => spec._id === specialization?._id
    );
    setDoctors(selectedSpecialization?.doctors);
    setDoctor(selectedSpecialization?.doctors[0] || null);
  }, [specialization]);

  // Dữ liệu cho SelectList
  const specData = specializations.map((spec: any) => ({
    key: spec._id,
    value: spec.name,
  }));

  const docData = doctors.map((doc: any) => ({
    key: doc._id,
    value: doc.account.name,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Khoa {index}</Text>
        {index != 1 && (
          <TouchableOpacity
            onPress={onClickDeleteSpecialization}
            style={styles.deleteButton}
          >
            <Image
              source={require("@/assets/icons/bin.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {/* Chuyên khoa */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Chuyên khoa:</Text>
        <SelectList
          setSelected={(val: any) => {
            const selectedSpecialization = specializations.find(
              (spec: any) => spec._id === val
            );
            updateSpec(index - 1, { spec: selectedSpecialization || null });
            setSpecialization(selectedSpecialization || null);
            setDoctor(selectedSpecialization?.doctors[0] || null);
            setDoctors(selectedSpecialization?.doctors || []);
          }}
          data={specData}
          save="key"
          boxStyles={styles.value}
          placeholder="Chọn chuyên khoa"
          defaultOption={{
            key: specialization?._id || "",
            value: specialization?.name || "Chưa chọn",
          }}
        />
      </View>

      {/* Bác sĩ */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Bác sĩ:</Text>
        <SelectList
          setSelected={(val: string) => {
            const selectedDoctor = doctors.find((doc: any) => doc._id === val);
            updateSpec(index - 1, { doctor: selectedDoctor || null });
            setDoctor(selectedDoctor || null);
          }}
          data={docData}
          save="key"
          boxStyles={styles.value}
          placeholder="Chọn bác sĩ"
          defaultOption={{
            key: doctor?._id || "",
            value: doctor?.account?.name || "Chưa chọn",
          }}
        />
      </View>

      {/* Chức vụ */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Chức vụ:</Text>
        <Text style={styles.value}>
          {doctor && doctor.position
            ? DoctorPosition[doctor.position as keyof typeof DoctorPosition]
            : "Chưa chọn"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: Colors.primary.lightBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: Colors.danger.background,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.primary.main,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: Colors.primary.main,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: Colors.primary.main,
    color: Colors.primary.main,
  },
});
