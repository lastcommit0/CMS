import { Request, Response } from "express";
import { addStorySchema } from "../validators/storySectionSchema";
import { addStorySection } from "../services/storySectionService";
import { AuditService } from "../services/auditService";

export const addStory = async (req: Request, res: Response) => {
  const payload = addStorySchema.parse(req.body);
  const sectionId = req.params.id;

  const result = await addStorySection(sectionId, payload);

  await AuditService.logAudit({
    userId: req.user?.id, 
    action: "STORY_ADDED_TO_SECTION",
    resource: "StorySection",
    metadata: {
      sectionId,
      storyId: payload.storyId,
    },
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    data: result,
  });
};
