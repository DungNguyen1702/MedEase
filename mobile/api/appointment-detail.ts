import axiosClient from "@/utils/axios-custom";

export const AppointmentDetailAPI = {
  getAppointmentDetailByDate: async (date: string) => {
    try {
      const response = await axiosClient.application.get(
        `/appointment-detail/details-by-date?date=${date}`
      );
      // ${formattedDate}
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
