import axiosClient from "../utils/axios-custom";

export const predictDiseaseAPI = {
  getPredictDisease: async (input: string) => {
    try {
      const response = await axiosClient.predictedAxios.post("/predict", {
        Patient_Problem: input,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
