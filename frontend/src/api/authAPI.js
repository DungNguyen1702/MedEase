import axiosClient from "../utils/axiosCustomize";

export const AuthAPI = {
  login : async (email, password) => {
    const url = "/auth/login"
    return  await axiosClient.application.post(url, {
      email,
      password,
    });
  }
}