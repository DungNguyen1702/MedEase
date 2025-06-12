import axiosClient from "@/utils/axios-custom";
import validator from "validator";

interface LoginParams {
  gmail: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const AuthAPI = {
  LoginAPI: async ({ gmail, password }: LoginParams) => {
    try {
      if (!validator.isEmail(gmail)) {
        throw new Error("Địa chỉ email không hợp lệ");
      }
      const response = await axiosClient.applicationNoAuth.post("/auth/login", {
        email: gmail,
        password: password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  Register: async ({
    email,
    password,
    confirmPassword,
    name,
  }: RegisterParams) => {
    try {
      if (!validator.isEmail(email)) {
        throw new Error("Địa chỉ email không hợp lệ");
      }
      const response = await axiosClient.applicationNoAuth.post(
        "/auth/register",
        {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          name: name,
          verifyLink: `${process.env.EXPO_PUBLIC_WEB_URL}/auth/verify-register-email`,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ResetPassword: async (email: string) => {
    try {
      if (!validator.isEmail(email)) {
        throw new Error("Địa chỉ email không hợp lệ");
      }
      const response = await axiosClient.applicationNoAuth.post(
        "/auth/reset-password",
        {
          email: email,
          resetLink: `${process.env.EXPO_PUBLIC_WEB_URL}/auth/reset-password-form`,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
