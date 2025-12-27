import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as reportController from "../controllers/reportController";

const router = Router();


router.post("/report", catchAsync(reportController.generateReport));


export default router;