import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import FakeData from "@/data/fake_data.json";
import InputComponent from "@/components/InputComponent";
import { Colors } from "@/constants/Colors";
import MedicalRecordComponent from "@/components/MedicalRecordComponent";

export default function MedicalRecord() {
  const medicalRecord = FakeData.medical_records;
  const [search, setSearch] = useState("");
  const [filteredMedicalRecords, setFilteredMedicalRecords] =
    useState(medicalRecord);

  useEffect(() => {
    // Filter medical records based on search input
    const filteredMedicalRecords = medicalRecord.filter(
      (record) =>
        record.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
        record.symptoms.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMedicalRecords(filteredMedicalRecords);
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
        {filteredMedicalRecords.map((medicalRecord, index) => (
          <MedicalRecordComponent key={index} medicalRecord={medicalRecord} />
        ))}
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
  searchInput: {
    marginBottom: 20,
    paddingVertical: 10,
  },
});
