import axios from "axios";
import axiosClient from "../utils/axiosCustomize";

export const AuthAPI = {
  login : async (email, password) => {
    const url = "/auth/login"
    return  await axiosClient.application.post(url, {
      email,
      password,
    });
  },
  register : async (email, name, password, confirmPassword) => {
    const url = "/auth/register";
    return await axiosClient.application.post(url, {
      email,
      name,
      password,
      confirmPassword,
      verifyLink : `${import.meta.env.VITE_PUBLIC_DEPLOYED_URL}/auth/verify-register-email`,
    });
  },
  verifyRegister : async (token) => {
    const url = "/auth/verify";
    return await axiosClient.application.post(url, {
      token,
    });
  },
  forgotPassword : async (email, resetLink) => {
    const url = "/auth/reset-password";
    return await axiosClient.application.post(url, {
      email,
      resetLink : `${import.meta.env.VITE_PUBLIC_DEPLOYED_URL}/auth/reset-password-form`,
    });
  },
  verifyResetPassword : async (token, newPassword, confirmPassword) => {
    const url = "/auth/change-password";

    return await axiosClient.applicationNoAuth.put(url, {
      newPassword,
      confirmPassword,
      token,
    });
  }
}