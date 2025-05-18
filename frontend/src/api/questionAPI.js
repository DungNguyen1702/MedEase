import axiosClient from "../utils/axiosCustomize";

export const questionAPI = {
  getAllQuestions : async ()=>{
    const url = "/question-answer";
    return await axiosClient.applicationNoAuth.get(url);
  },
  createAnswer : async (questionId, content) =>{
    const url = `/question-answer/create-answer`;
    return await axiosClient.application.post(url, {questionId, content});
  }
}