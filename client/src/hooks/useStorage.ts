import { useMutation } from "@tanstack/react-query";
import { storageApi } from "@/services/storageService";
import { toast } from "sonner";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await storageApi.uploadImage(file);
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload image");
    },
  });
};

export const useUploadPdf = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await storageApi.uploadPdf(file);
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload PDF");
    },
  });
};

export const useUploadVideo = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await storageApi.uploadVideo(file);
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload video");
    }
  })
}
