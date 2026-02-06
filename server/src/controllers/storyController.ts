import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import {
    createStorySchema,
    updateStorySchema,
    addAssetSchema,
    bulkStatusSchema
} from '../validators/storySchema';

import { StoryService } from '../services/storyService';

export const getStories = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filters: any = {};
    if (req.query.search) {
        filters.OR = [
            { title: { contains: req.query.search, mode: 'insensitive' } },
            { excerpt: { contains: req.query.search, mode: 'insensitive' } }
        ];
    }
    if (req.query.storyType) filters.storyType = req.query.storyType;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.published !== undefined) filters.published = req.query.published === 'true';
    if (req.query.authorId) filters.authorId = req.query.authorId;

    const result = await StoryService.listStories(filters, {
        skip: (page - 1) * limit,
        take: limit
    });

    res.json({ success: true, ...result });
};

export const getStoryById = async (req: Request, res: Response, next: NextFunction) => {
    const story = await StoryService.getById(req.params.id);
    res.json({ success: true, data: story });
};

export const createStory = async (req: Request, res: Response, next: NextFunction) => {
    const data = createStorySchema.parse(req.body);
    const story = await StoryService.create(data, req.user!.id);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'STORY_CREATED',
            resource: 'Story',
            metadata: { storyId: story.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.status(201).json({ success: true, data: story });
};

export const updateStory = async (req: Request, res: Response, next: NextFunction) => {
    const data = updateStorySchema.parse(req.body);
    const story = await StoryService.update(req.params.id, data, req.user!.id);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'STORY_UPDATED',
            resource: 'Story',
            metadata: { storyId: req.params.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true, data: story });
};

export const deleteStory = async (req: Request, res: Response, next: NextFunction) => {
    await StoryService.delete(req.params.id);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'STORY_DELETED',
            resource: 'Story',
            metadata: { storyId: req.params.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true, data: {} });
};


export const stats = async (req: Request, res: Response, next: NextFunction) => {
    const stats = await StoryService.stats();
    if (stats) {
        console.log('Stats found');
    } else {
        console.log('No stats found');
    }
    res.json({ success: true, data: stats });
};

export const addStoryAsset = async (req: Request, res: Response, next: NextFunction) => {
    const data = addAssetSchema.parse(req.body);
    const asset = await StoryService.addAsset(req.params.id, data);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'STORY_ASSET_ADDED',
            resource: 'Story',
            metadata: { storyId: req.params.id, assetId: asset.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.status(201).json({ success: true, data: asset });

};

export const deleteStoryAsset = async (req: Request, res: Response, next: NextFunction) => {
    const { assetId } = req.params;
    await StoryService.deleteAsset(req.params.id, assetId);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'STORY_ASSET_DELETED',
            resource: 'Story',
            metadata: { storyId: req.params.id, assetId },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true, message: 'Asset deleted successfully' });

};

export const bulkUpdateStories = async (req: Request, res: Response, next: NextFunction) => {
    const data = bulkStatusSchema.parse(req.body);
    const { storyIds, ...updateData } = data;

    const result = await StoryService.bulkUpdate(storyIds, updateData);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'STORIES_BULK_UPDATED',
            resource: 'Story',
            metadata: { storyIds: storyIds },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true, data: result });
};

export const bulkDeleteStories = async (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) throw new Error('ids array is required');

    const result = await StoryService.bulkDelete(ids);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'STORIES_BULK_DELETED',
            resource: 'Story',
            metadata: { storyIds: ids },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true, data: result });
};