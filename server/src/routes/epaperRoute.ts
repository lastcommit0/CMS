import { Router } from "express";
import catchAsync from "../middleware/catchAsync";
import { EpaperController } from "../controllers/epaperController";

const router = Router();
const epaperController = new EpaperController();

router.post("/epapers", catchAsync(epaperController.createEpaper));
router.get("/epapers", catchAsync(epaperController.getAllEpapers));
router.get("/epapers/:id", catchAsync(epaperController.getEpaperById));
router.patch("/epapers/:id", catchAsync(epaperController.updateEpaper));
router.delete("/epapers/:id", catchAsync(epaperController.deleteEpaper));


export default router;
