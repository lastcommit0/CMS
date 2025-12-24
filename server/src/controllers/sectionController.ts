// src/modules/section/section.controller.ts
import { Request, Response } from 'express';
import { SectionService } from '../services/sectionService';
import {
  createSectionSchema,
  updateSectionSchema,
  addStorySchema,
  setFeaturedSchema
} from '../validators/sectionSchema';

export const SectionController = {
  async getSections(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await SectionService.getAll({
      page,
      limit,
      search: req.query.search,
      isActive: req.query.isActive === 'true'
    });

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total
      }
    });
  },

  async getSection(req: Request, res: Response) {
    const section = await SectionService.getById(req.params.id);
    res.json({ success: true, data: section });
  },

  async createSection(req: Request, res: Response) {
    const data = createSectionSchema.parse(req.body);
    const section = await SectionService.create(
      req.user!.id,
      req.ip || 'unknown',
      data
    );

    res.status(201).json({ success: true, data: section });
  },

  async updateSection(req: Request, res: Response) {
    const data = updateSectionSchema.parse(req.body);
    const section = await SectionService.update(
      req.user!.id,
      req.ip || 'unknown',
      req.params.id,
      data
    );

    res.json({ success: true, data: section });
  },

  async deleteSection(req: Request, res: Response) {
    await SectionService.delete(
      req.user!.id,
      req.ip || 'unknown',
      req.params.id
    );

    res.json({ success: true });
  },

  async addStory(req: Request, res: Response) {
    const data = addStorySchema.parse(req.body);

    const record = await SectionService.addStory(
      req.user!.id,
      req.ip || 'unknown',
      req.params.id,
      data
    );

    res.status(201).json({ success: true, data: record });
  },

  async setFeatured(req: Request, res: Response) {
    const { isFeatured } = setFeaturedSchema.parse(req.body);

    const record = await SectionService.setFeatured(
      req.user!.id,
      req.ip || 'unknown',
      req.params.id,
      req.params.storyId,
      isFeatured
    );

    res.json({ success: true, data: record });
  }
};
