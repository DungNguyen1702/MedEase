import axiosClient from "../utils/axiosCustomize";

export const accountAPI = {
    createAccount: async (data) => {
        const url = "/accounts";
        return await axiosClient.application.post(url, data);
    },
    updateAccount: async (data) => {
        const url = "/accounts";
        return await axiosClient.formData.put(url, data);
    },
    updatePassword: async (data) => {
        const url = "/accounts/change-password";
        return await axiosClient.application.put(url, data);
    },
    updateAccountByAdmin: async (data) => {
        const url = "/accounts/update-by-admin";
        return await axiosClient.application.put(url, data);
    },
    deleteAccount: async (id) => {
        const url = `/accounts/${id}`;
        return await axiosClient.application.delete(url);
    },
};
