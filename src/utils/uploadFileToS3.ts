import apiClient from "./axios";

export const uploadFileToS3 =async (formData: any, woId: string )  => {
  const uploadRes = await apiClient.post("/document/upload/"+ woId, formData);
  console.log("Upload Res : ", uploadRes);
    return uploadRes
};

export const uploadFileToS3Estimate =async (formData: any, woId: string )  => {
  const uploadRes = await apiClient.post("/estiamte/document/upload/"+ woId, formData);
  console.log("Upload Res : ", uploadRes);
  return uploadRes
};

export const uploadFileToS3Users = async (formData: any, userId: string )  => {
  const uploadRes = await apiClient.post("/user/document/upload/"+ userId, formData);
  return uploadRes
};


export const uploadFileToS3Task = async (formData: any, taskId: string )  => {
  const uploadRes = await apiClient.post("/task/document/upload/"+ taskId, formData);
  return uploadRes
};