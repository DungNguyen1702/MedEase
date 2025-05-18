import axiosClient from "../utils/axiosCustomize";

export const appointmentAPI = {
  getAllAppointments : async ()=>{
    const url = "/appointment/admin-appointment";
    return await axiosClient.application.get(url);
  },
  getAppointmentDetail : async (id) =>{
    const url = `/appointment/appointment-detail/${id}`;
    return await axiosClient.application.get(url);
  },
  createAppointment : async (patientId, data) =>{
    const url = `/appointment/admin-appointment/${patientId}`;
    return await axiosClient.application.post(url, data);
  },
  updateAppointment : async (id, data) =>{ 
    const url = `/appointment/admin-appointment/${id}`;
    return await axiosClient.application.put(url, data);
  },
  deleteAppointment : async (id) =>{ 
    const url = `/appointment/admin-appointment/${id}`;
    return await axiosClient.application.delete(url);
  },
  updateAppointmentDetail : async (data) =>{
    const url = `/appointment-detail/update-appointment-detail`;
    return await axiosClient.application.put(url, data);
  }
}