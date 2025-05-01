import axiosClient from "@/utils/axios-custom";

export const questionAPI = {
  getAll: async () => {
    try {
      const response = await axiosClient.application.get("/question-answer");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createQuestion: async (content: string) => {
    try {
      const response = await axiosClient.application.post("/question-answer", {
        content,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
