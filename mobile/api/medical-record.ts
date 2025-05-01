import axiosClient from "@/utils/axios-custom";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const MedicalRecordAPI = {
  getMedicalRecord: async () => {
    try {
      const response = await axiosClient.application.get(`/medical-record`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getMedicalRecordDetail: async (id: string) => {
    try {
      const response = await axiosClient.application.get(
        `/medical-record/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
