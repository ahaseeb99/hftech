import apiClient from "../utils/axios";

export const loginAPI = async (data: any) => {
  return await apiClient.post("/auth/login", data);
};
