import { Router } from "express";
import catchAsync from "../middleware/catchAsync";
import * as contactController from "../controllers/contactController";

const router = Router();

router.get("/messages", catchAsync(contactController.getMessages));
router.delete("/messages/:id", catchAsync(contactController.deleteMessage));

export default router;
