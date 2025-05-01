import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import InputComponent from "@/components/InputComponent";
import { Colors } from "@/constants/Colors";
import MedicalRecordComponent from "@/components/MedicalRecordComponent";
import { MedicalRecordAPI } from "@/api/medical-record";

export default function MedicalRecord() {
  const [medicalRecord, setMedicalRecord] = useState<
    { diagnosis: string; symptoms: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [filteredMedicalRecords, setFilteredMedicalRecords] =
    useState(medicalRecord);

  const callAPI = async () => {
    try {
      const response = await MedicalRecordAPI.getMedicalRecord();
      setMedicalRecord(response);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    }
  };
  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    setFilteredMedicalRecords(medicalRecord);
  }, [medicalRecord]);

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
