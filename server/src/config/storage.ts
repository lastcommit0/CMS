import { CloudinaryStorage } from "multer-storage-cloudinary";  
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    const isPdf = file.mimetype === "application/pdf";

    let folder = "others";
    let resource_type: "video" | "image" | "raw" = "raw";
    let transformation: any[] = [];

    if (isImage) {
      folder = "cms/images";
      resource_type = "image";
      transformation = [{ quality: "auto", fetch_format: "auto" }];
    } else if (isVideo) {
      folder = "cms/videos";
      resource_type = "video";
    } else if (isPdf) {
      folder = "cms/pdfs";
    }

    const cleanName = file.originalname
      .split('.')[0]
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${cleanName}`,
      transformation, 
      allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "pdf", "webp"], 
    };
  },
});


export const upload = multer({
    storage,
    limits: {fileSize: 10 * 1024 * 1024}, 
    fileFilter: (_, file, cb)=> {

        if(
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/") ||
            file.mimetype === "application/pdf"
        ) cb(null, true);
        else cb(new Error("Invalid file type") as any, false);
    }
});


