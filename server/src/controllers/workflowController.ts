import { Request, Response, NextFunction } from "express";
import { StoryWorkflowService } from "../services/workflowService";

export const submitStory = async (req: Request, res: Response, next: NextFunction) => {
    const story = await StoryWorkflowService.submit(req.params.id, req.user!.id);
    res.json({ success: true, data: story });
};

export const approveStory = async (req: Request, res: Response, next: NextFunction) => {
    const story = await StoryWorkflowService.approve(req.params.id, req.user!.id);
    res.json({ success: true, data: story });
};

export const publishStory = async (req: Request, res: Response, next: NextFunction) => {
    const story = await StoryWorkflowService.publish(req.params.id, req.user!.id);
    res.json({ success: true, data: story });
};

export const rejectStory = async (req: Request, res: Response, next: NextFunction) => {
    const { reason } = req.body;
    const story = await StoryWorkflowService.reject(req.params.id, req.user!.id, reason);
    res.json({ success: true, data: story });
};