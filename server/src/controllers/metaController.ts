import { Request, Response } from 'express';
import { MetaService } from '../services/metaService';
import { metaTagSchema, bulkGenerateMetaSchema } from '../validators/metaSchema';

export const getMetaTags = async (req: Request, res: Response) => {
  const data = await MetaService.getMetaTags(req.params.storyId);

  res.json({ success: true, data });
};

export const upsertMetaTags = async (req: Request, res: Response) => {
  const payload = metaTagSchema.parse(req.body);

  const data = await MetaService.upsertMetaTags(
    req.params.storyId,
    payload,
    req.user!.id,
    req.ip || 'unknown'
  );

  res.json({ success: true, data });
};

export const bulkGenerateMetaTags = async (req: Request, res: Response) => {
  const { storyIds } = bulkGenerateMetaSchema.parse(req.body);

  const count = await MetaService.bulkGenerate(
    storyIds,
    req.user!.id,
    req.ip || 'unknown'
  );

  res.json({ success: true, count });
};
