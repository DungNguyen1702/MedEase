import axiosClient from "../utils/axiosCustomize";

export const statisticAPI = {
  getStatisticByAdmin: async () => {
    const url ="/statistic/admin-statistic";
    return await axiosClient.application.get(url);
  },
  getStatisticByDoctor: async () => {
    const url ="/statistic/doctor-statistic";
    return await axiosClient.application.get(url);
  },
}