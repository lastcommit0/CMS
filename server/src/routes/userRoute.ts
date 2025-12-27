import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/users", catchAsync(userController.getUsers));
router.get("/user/:id", catchAsync(userController.getUser));
router.post("/user/:id", catchAsync(userController.updateUser));
router.delete("/user/:id", catchAsync(userController.deleteUser));
router.post("/user/:id/profile", catchAsync(userController.updateUserProfile));
router.post("/user/:id/password", catchAsync(userController.changePassword));
router.get("/user/:id/stats", catchAsync(userController.getUserStats));
router.get("/user/:id/activity", catchAsync(userController.getUserActivity));


export default router;