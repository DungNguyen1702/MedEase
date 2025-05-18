import axiosClient from "../utils/axiosCustomize";

export const specAPI = {
  getAllSpec : async()=>{
    const url = "/specialization";
    return await axiosClient.applicationNoAuth.get(url);
  }
}