import axiosClient from "@/utils/axios-custom";

export const notifiAPI = {
  getNoti: async () => {
    try {
      const response = await axiosClient.application.get(`/notification`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  readNoti: async (id: string) => {
    try {
      const response = await axiosClient.application.put(
        `/notification/read/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
