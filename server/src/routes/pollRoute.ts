import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as pollController from "../controllers/pollController";

const router = Router();


router.get("/polls", catchAsync(pollController.getPolls));
router.get("/poll/:id", catchAsync(pollController.getPollById));
router.post("/poll", catchAsync(pollController.createPoll));
router.post("/poll/:id", catchAsync(pollController.updatePoll));
router.delete("/poll/:id", catchAsync(pollController.deletePoll));
router.post("/poll/:id/vote", catchAsync(pollController.vote));
router.get("/poll/:id/results", catchAsync(pollController.getResults));
router.post("/poll/:id/options", catchAsync(pollController.addOption));
router.post("/poll/:id/options/:optionId", catchAsync(pollController.updateOption));
router.delete("/poll/:id/options/:optionId", catchAsync(pollController.deleteOption));


export default router;