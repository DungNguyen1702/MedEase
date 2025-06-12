import axiosClient from "../utils/axiosCustomize";

export const predictDiseaseAPI = {
  getPredictDisease: async (input) => {
    const url = '/predict';
    const response = await axiosClient.predictedAxios.post(url, {
      Patient_Problem: input,
    });
    return response;
  },
}
