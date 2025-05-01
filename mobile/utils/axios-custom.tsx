import axios from "axios";
import { store } from "@/redux/store";

const serializeParams = (params: Record<string, any>) => {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};

const axiosClient = {
  application: axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    // baseURL: "https://ggfn6s55-8000.asse.devtunnels.ms",
    headers: {
      "content-type": "application/json",
    },
    paramsSerializer: serializeParams,
  }),

  applicationNoAuth: axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
      "content-type": "application/json",
    },
    paramsSerializer: serializeParams,
  }),

  formData: axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
      "content-type": "multipart/form-data",
    },
  }),

  formDataAuth: axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
      "content-type": "multipart/form-data",
    },
  }),
};

// // Add interceptors to inject token into requests
// const addAuthInterceptor = (client: any) => {
//   client.interceptors.request.use(
//     async (config: any) => {
//       const state = store.getState(); // Lấy state từ Redux store
//       const token = state.auth?.token; // Giả sử token được lưu trong state.auth.token

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
//       }
//       return config;
//     },
//     (error: any) => {
//       return Promise.reject(error);
//     }
//   );
// };

// // Thêm interceptor cho các instance cần token
// addAuthInterceptor(axiosClient.application);
// addAuthInterceptor(axiosClient.formDataAuth);

export default axiosClient;
