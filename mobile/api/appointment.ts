import axiosClient from "@/utils/axios-custom";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { create } from "react-test-renderer";

export const AppointmentAPI = {
  getAppHistory: async () => {
    try {
      const response = await axiosClient.application.get(
        `/appointment/history`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAppHistoryDetail: async (id: string) => {
    try {
      const response = await axiosClient.application.get(
        `/appointment/history-detail/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAppointmentNum: async () => {
    try {
      const response = await axiosClient.application.get(
        `/appointment/appointment-num`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createAppointment: async (data: any) => {
    try {
      const response = await axiosClient.application.post(`/appointment`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createAppoinetmentZalo: async (data: any) => {
    try {
      const response = await axiosClient.application.post(
        `/zalo-payment/payment`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createAppoinetmentMomo: async (data: any) => {
    try {
      const response = await axiosClient.application.post(
        `/momo-payment/payment`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  checkStatusMomo: async (code: string) => {
    console.log("code : ", code);
    try {
      const response = await axiosClient.applicationNoAuth.get(
        `/momo-payment/check-status/${code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  checkStatusZalo: async (code: string) => {
    try {
      const response = await axiosClient.applicationNoAuth.get(
        `/zalo-payment/check-status/${code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAppoinemtmentDetailPayment: async (code: string, type: string) => {
    try {
      const response = await axiosClient.application.get(
        `/appointment/appoinemtment-detail-payment?paymentCode=${code}&paymentType=${type}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
