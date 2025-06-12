import axiosClient from "../utils/axiosCustomize";

export const doctorAPI = {
  getAllDoctors : async()=>{
    const url = "/doctor/get-all-doctor";
    return await axiosClient.applicationNoAuth.get(url);
  },
  getDoctorRoomData : async(date)=>{
    const url = `/doctor/data-doctor-room?date=${date}`;
    return await axiosClient.application.get(url);
  },
  nextNum : async (date) => {
    const url = `/doctor/next-number?date=${date}`;
    return await axiosClient.application.get(url);
  },
  getExaminatedPatients : async () => {
    const url = `/patient/examined_patients`;
    return await axiosClient.application.get(url);
  },
}