import axios from 'axios';
import queryString from 'query-string';

const axiosClient = {
  application: axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL || 'http://fallback-api-url.com',

    headers: {
      'content-type': 'application/json',
      'Accept-Language': 'vi',
    },
    paramsSerializer: (params) => queryString.stringify(params),
  }),

  applicationNoAuth: axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,

    headers: {
      'content-type': 'application/json',
      'Accept-Language': 'vi',
    },
    paramsSerializer: (params) => queryString.stringify(params),
  }),

  formData: axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,

    headers: {
      'content-type': 'multipart/form-data',
      'Accept-Language': 'vi',
    },
  }),

  formDataAuth: axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,

    headers: {
      'content-type': 'multipart/form-data',
      'Accept-Language': 'vi',
    },
  }),

  formDataNoAuth: axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,

    headers: {
      'content-type': 'multipart/form-data',
      'Accept-Language': 'vi',
    },
  }),

  predictedAxios : axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL_AI,

    headers: {
      'content-type': 'application/json',
      'Accept-Language': 'vi',
    },
    paramsSerializer: (params) => queryString.stringify(params),
  }),
};

const handleLogout = (navigate, toast) => {
  toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
  setTimeout(() => {
    localStorage.removeItem('user_info');
    localStorage.removeItem('access_token');
    navigate('/auth/login');
  }, 5000);
};

export const setupInterceptors = (navigate, toast, logout) => {
  // ✅ Gắn token động trước mỗi request
  axiosClient.application.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  axiosClient.formData.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Interceptor response: xử lý khi token hết hạn
  axiosClient.application.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403 && data.message === 'Token has expired') {
          logout?.(); // Gọi hàm logout nếu có
        }
      }
      return Promise.reject(error);
    }
  );

  axiosClient.formData.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403 && data.message === 'Token has expired') {
          handleLogout(navigate, toast);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosClient;