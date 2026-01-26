import { CloudinaryStorage } from "multer-storage-cloudinary";  
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';


const storage = new CloudinaryStorage({
    cloudinary,

    params: async (__dirname, file)=>{
        
        let folder = "others";
        let resource_type: "video" | "image" | "raw" = "raw";

        if(file.mimetype.startsWith("image/")){
            folder = "images";
            resource_type = "image";
        }
        if(file.mimetype.startsWith("video/")){
            folder = "videos";
            resource_type = "video";
        }
        if(file.mimetype === "application/pdf"){
            folder = "pdfs";
            resource_type = "raw";
        }

        return {
            folder,
            resource_type,
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
        };
    }
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


