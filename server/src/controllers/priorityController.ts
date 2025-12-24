import { Request, Response } from 'express';
import { PriorityService } from '../services/priorityService';
import { updatePrioritySchema, bulkPrioritySchema } from '../validators/prioritySchema';

export const getPriorities = async (req: Request, res: Response) => {
  const data = await PriorityService.getPriorities(req.query.sectionId as string);
  res.json({ success: true, data });
};

export const updatePriority = async (req: Request, res: Response) => {
  const { priority } = updatePrioritySchema.parse(req.body);

  const data = await PriorityService.updatePriority(
    req.params.storyId,
    req.params.sectionId,
    priority,
    req.user!.id
  );

  res.json({ success: true, data });
};

export const bulkUpdatePriorities = async (req: Request, res: Response) => {
  const { updates } = bulkPrioritySchema.parse(req.body);

  await PriorityService.bulkUpdate(updates, req.user!.id, req.ip || 'unknown');

  res.json({ success: true });
};
