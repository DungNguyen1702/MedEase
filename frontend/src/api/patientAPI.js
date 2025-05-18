import axiosClient from "../utils/axiosCustomize";

export const patientAPI = {
  getAllPatients: async () => {
    const url = "/patient"
    return  await axiosClient.applicationNoAuth.get(url);
  },
  getExaminatedPatients: async () => {
    const url = "/patient/examined_patients";
    return await axiosClient.application.get(url);
  },
  getPatientProfile: async (patientId) =>{
    const url = `/patient/patient-profile/${patientId}`;
    return await axiosClient.application.get(url);
  }
}