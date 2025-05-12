import axiosClient from "../utils/axiosCustomize";

export const patientAPI = {
  getAllPatients: async () => {
    const url = "/patient"
    return  await axiosClient.applicationNoAuth.get(url);
  }
}