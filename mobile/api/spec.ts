import axiosClient from "@/utils/axios-custom";
import validator from "validator";

export const SpecAPI = {
  getAllSpec: async () => {
    try {
      const response = await axiosClient.applicationNoAuth.get(
        "/specialization"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getSpecById: async (id: string) => {
    try {
      const response = await axiosClient.applicationNoAuth.get(
        `/specialization/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
