import { PrismaClient, Prisma } from '../generated/prisma/client'
import prisma from "../db";
import { StoryStatus } from "../generated/prisma/client";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";
import { logger } from "../utils/logger";

type TransactionClient = PrismaClient;

export class StoryWorkflowService {
    private static readonly TRANSITIONS: Record<StoryStatus, StoryStatus[]> = {
        DRAFT: ["SUBMITTED", "REJECTED"],
        SUBMITTED: ["REVIEW", "REJECTED"],
        REVIEW: ["CHANGES_REQUESTED", "APPROVED", "REJECTED"],
        CHANGES_REQUESTED: ["SUBMITTED", "REJECTED"],
        APPROVED: ["SCHEDULED", "PUBLISHED"],
        SCHEDULED: ["PUBLISHED", "DRAFT"],
        PUBLISHED: ["UNPUBLISHED"],
        UNPUBLISHED: ["DRAFT"],
        REJECTED: ["DRAFT"],
    };

    static async transitionStatus(
        storyId: string,
        newStatus: StoryStatus,
        userId: string,
        reason?: string,
        transactionContext?: TransactionClient
    ) {
        const client = transactionContext || prisma;

        return client.$transaction(async (tx) => {
            const story = await tx.story.findUnique({
                where: { id: storyId },
                select: { id: true, status: true, content: true },
            });

            if (!story) throw new CustomError(ErrorCode.STORY_NOT_FOUND);

            const allowedTransitions = this.TRANSITIONS[story.status];

            if (!allowedTransitions.includes(newStatus)) {
                throw new CustomError({
                    statusCode: 400,
                    message: `Invalid transition: ${story.status} -> ${newStatus}`,
                    code: "INVALID_STATUS_TRANSITION",
                });
            }

            const [updatedStory] = await Promise.all([
                tx.story.update({
                    where: { id: storyId },
                    data: {
                        status: newStatus,
                        publishedAt: newStatus === "PUBLISHED" ? new Date() : undefined,
                    },
                }),

                tx.storyVersion.create({
                    data: {
                        storyId,
                        content: story.content ?? Prisma.JsonNull,
                        editedBy: userId,
                        reason: reason ?? `Status → ${newStatus}`,
                    },
                }),

                tx.auditLog.create({
                    data: {
                        userId,
                        action: "STORY_STATUS_CHANGED",
                        resource: "Story",
                        metadata: { from: story.status, to: newStatus, reason },
                        ipAddress: "system",
                    },
                }),
            ]);

            logger.info(
                { storyId, userId, transition: `${story.status}->${newStatus}` },
                "Story status updated"
            );

            return updatedStory;
        });
    }

    static submit(id: string, userId: string) {
        return this.transitionStatus(id, "SUBMITTED", userId);
    }

    static approve(id: string, userId: string) {
        return this.transitionStatus(id, "APPROVED", userId);
    }

    static publish(id: string, userId: string) {
        return this.transitionStatus(id, "PUBLISHED", userId);
    }

    static reject(id: string, userId: string, reason?: string) {
        return this.transitionStatus(id, "REJECTED", userId, reason);
    }
}
