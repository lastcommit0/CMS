import { Router } from "express";
import catchAsync from "../middleware/catchAsync";
import { uploadImage, uploadVideo, uploadPdf, deleteMedia, updateMedia } from "../controllers/storageController";
import { upload } from "../config/storage";

const router = Router();


router.post("/upload/image", upload.single("image"), catchAsync(uploadImage));
router.post("/upload/video", upload.single("video"), catchAsync(uploadVideo));
router.post("/upload/pdf", upload.single("pdf"), catchAsync(uploadPdf));
router.delete("/pdf/:id", catchAsync(deleteMedia));
router.delete("/image/:id", catchAsync(deleteMedia));
router.delete("/video/:id", catchAsync(deleteMedia));
router.patch("/image/:id", upload.single("image"), catchAsync(updateMedia));
router.patch("/video/:id", upload.single("video"), catchAsync(updateMedia));
router.patch("/pdf/:id", upload.single("pdf"), catchAsync(updateMedia));


export default router;
