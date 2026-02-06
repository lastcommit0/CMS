import apiClient from "@/lib/api/axiosClient";
import { STORAGE_URL } from "@/lib/config";
import { Form } from "react-router-dom";

export type UploadResponse = {
  id: string;
  fileUrl: string;
  publicId: string;
  mimeType: string;
  size: number;
};

export const storageApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post<UploadResponse>(`${STORAGE_URL}/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadPdf: (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    return apiClient.post<UploadResponse>(`${STORAGE_URL}/upload/pdf`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadVideo: (file: File)=>{
    const formData = new FormData();
    formData.append("video", file);
    return apiClient.post<UploadResponse>(`${STORAGE_URL}/upload/video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.patch<UploadResponse>(`${STORAGE_URL}/image/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateVideo: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("video", file);
    return apiClient.patch<UploadResponse>(`${STORAGE_URL}/video/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updatePdf: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    return apiClient.patch<UploadResponse>(`${STORAGE_URL}/pdf/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteImage: (id: string) => {
    return apiClient.delete(`${STORAGE_URL}/image/${id}`);
  },
  deleteVideo: (id: string) => {
    return apiClient.delete(`${STORAGE_URL}/video/${id}`);
  },
  deletePdf: (id: string) => {
    return apiClient.delete(`${STORAGE_URL}/pdf/${id}`);
  }
};
