import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/register", catchAsync(authController.register));
router.post("/login", catchAsync(authController.login));
router.post("/refresh", catchAsync(authController.refresh));
router.post("/logout", catchAsync(authController.logout));
router.post("/logoutAll", catchAsync(authController.logoutAll));    

export default router;