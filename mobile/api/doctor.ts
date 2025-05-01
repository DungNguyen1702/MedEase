import axiosClient from "@/utils/axios-custom";

export const doctorAPI = {
  getCurrentNumber: async (id: string) => {
    try {
      const response = await axiosClient.applicationNoAuth.get(
        `/doctor/get-current-number/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getDoctorRoom: async (id: string) => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const response = await axiosClient.applicationNoAuth.get(
        `/doctor/doctor-room/${id}?date=2025-04-10`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
