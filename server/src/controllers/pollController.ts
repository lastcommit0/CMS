import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import {
    createPollSchema,
    updatePollSchema,
    voteSchema,
    addOptionSchema,
    pollListSchema
} from '../validators/pollSchema';
import { PollService } from '../services/pollService';

export const getPolls = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, status, storyId } = pollListSchema.parse(req.query);

    const filters: any = {};
    if (status) filters.status = status;
    if (storyId) filters.storyId = storyId;

    const result = await PollService.list(filters, {
        skip: (page - 1) * limit,
        take: limit
    });

    res.json({
        success: true,
        data: result.polls,
        pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        }
    });
};

export const getPollById = async (req: Request, res: Response, next: NextFunction) => {
    const poll = await PollService.getById(req.params.id);
    res.json({ success: true, data: poll });
};

export const createPoll = async (req: Request, res: Response, next: NextFunction) => {
    const data = createPollSchema.parse(req.body);
    const poll = await PollService.create(data, req.user!.id);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'POLL_CREATED',
            resource: 'Poll',
            metadata: { pollId: poll.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.status(201).json({ success: true, data: poll });
};

export const updatePoll = async (req: Request, res: Response, next: NextFunction) => {
    const data = updatePollSchema.parse(req.body);
    const poll = await PollService.update(req.params.id, data);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'POLL_UPDATED',
            resource: 'Poll',
            metadata: { pollId: req.params.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true, data: poll });
};

export const deletePoll = async (req: Request, res: Response, next: NextFunction) => {
    await PollService.delete(req.params.id);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'POLL_DELETED',
            resource: 'Poll',
            metadata: { pollId: req.params.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true });
};

export const vote = async (req: Request, res: Response, next: NextFunction) => {
    const { optionId } = voteSchema.parse(req.body);
    const results = await PollService.vote(
        req.params.id,
        optionId,
        req.user?.id,
        req.ip
    );

    res.status(201).json({ success: true, data: results });
};

export const getResults = async (req: Request, res: Response, next: NextFunction) => {
    const results = await PollService.getResults(req.params.id);
    res.json({ success: true, data: results });
};

export const addOption = async (req: Request, res: Response, next: NextFunction) => {
    const { text } = addOptionSchema.parse(req.body);
    const option = await PollService.addOption(req.params.id, text);

    res.status(201).json({ success: true, data: option });
};

export const updateOption = async (req: Request, res: Response, next: NextFunction) => {
    const { text } = addOptionSchema.parse(req.body);
    const option = await PollService.updateOption(
        req.params.id,
        req.params.optionId,
        text
    );

    res.json({ success: true, data: option });
};

export const deleteOption = async (req: Request, res: Response, next: NextFunction) => {
    await PollService.deleteOption(req.params.id, req.params.optionId);
    res.json({ success: true });

};

export const expirePolls = async (_req: Request, res: Response, next: NextFunction) => {
    const result = await PollService.expirePolls();
    res.json({ success: true, data: { count: result.count } });
};
