import axiosClient from "@/utils/axios-custom";

export const AccountAPI = {
  updatePassword: async (data: any) => {
    try {
      const response = await axiosClient.application.put(
        `/accounts/change-password`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateInfo: async (data: any) => {
    try {
      const response = await axiosClient.formData.put(`/accounts`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
