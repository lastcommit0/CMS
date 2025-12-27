import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as categoryController from "../controllers/categoryController";

const router = Router();


router.get("/categories", catchAsync(categoryController.getCategories));
router.get("/category/:id", catchAsync(categoryController.getCategoryById));
router.post("/category", catchAsync(categoryController.createCategory));
router.post("/category/:id", catchAsync(categoryController.updateCategory));
router.delete("/category/:id", catchAsync(categoryController.deleteCategory));
router.get("/category/tree", catchAsync(categoryController.getTree));
router.post("/category/bulk", catchAsync(categoryController.bulkUpdate));
router.delete("/category/bulk", catchAsync(categoryController.bulkDelete));


export default router;