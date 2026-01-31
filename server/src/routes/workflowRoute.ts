import { Router } from "express";
import {
  submitStory,
  approveStory,
  publishStory,
  rejectStory
} from "../controllers/workflowController";
import catchAsync from "../middleware/catchAsync";

const router = Router();

router.post("/stories/:id/submit", catchAsync(submitStory));
router.post("/stories/:id/approve", catchAsync(approveStory));
router.post("/stories/:id/publish", catchAsync(publishStory));
router.post("/stories/:id/reject", catchAsync(rejectStory));

export default router;
