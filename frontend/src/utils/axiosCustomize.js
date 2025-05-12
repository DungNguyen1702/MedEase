import axios from 'axios';
import queryString from 'query-string';

const accessToken = localStorage.getItem('access_token');

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
      Authorization: `Bearer ${accessToken}`,
    },
  }),

  formDataNoAuth: axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,

    headers: {
      'content-type': 'multipart/form-data',
      'Accept-Language': 'vi',
    },
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

export const setupInterceptors = (navigate, toast) => {
  axiosClient.application.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403 && data.message === 'Token has expired') {
          handleLogout(navigate, toast);
        }
      }
      return Promise.reject(error);
    },
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
    },
  );
};

export default axiosClient;