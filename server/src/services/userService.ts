import prisma from "../db";
import CustomError from "../errors/customError";
import argon2 from "argon2";
import { ErrorCode } from "../errors/errorCode";


export class UserService {
    static async getUsers(params: {
        page: number;
        limit: number;
        search?: string;
        role?: string;
        status?: string;
    }) {
        const { page, limit, search, role, status } = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } }
            ];
        }

        if (role) where.role = role;
        if (status) where.status = status;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                include: {
                    profile: true,
                    manager: { select: { id: true, name: true, email: true } },
                    _count: { select: { stories: true, subordinates: true } }
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.user.count({ where })
        ]);

        const sanitizedUsers = users.map(({ passwordHash, ...u }) => u);

        return {
            users: sanitizedUsers,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit)
            }
        };
    }

    static async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                manager: { select: { id: true, name: true, email: true } },
                subordinates: { select: { id: true, name: true, email: true } },
                _count: { select: { stories: true, polls: true, reports: true } }
            }
        });

        if (!user) {
            throw new CustomError(ErrorCode.USER_NOT_FOUND);
        }

        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }

    static async updateUser(userId: string, data: any) {
        if (data.email || data.phone) {
            const existing = await prisma.user.findFirst({
                where: {
                    id: { not: userId },
                    OR: [
                        ...(data.email ? [{ email: data.email }] : []),
                        ...(data.phone ? [{ phone: data.phone }] : [])
                    ]
                }
            });

            if (existing) {
                throw new CustomError(ErrorCode.USER_EMAIL_EXISTS);
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            include: { profile: true }
        });

        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }

    static async deleteUser(targetUserId: string, performedByUserId: string) {
        if (targetUserId === performedByUserId) {
            throw new CustomError(ErrorCode.USER_CANNOT_DELETE_SELF);
        }

        await prisma.user.delete({ where: { id: targetUserId } });
    }

    static async updateUserProfile(userId: string, data: any) {
        return prisma.userProfile.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                designation: data.designation || "WRITER",
                jobType: data.jobType || "FULL_TIME",
                ...data
            }
        });
    }

    static async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ) {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new CustomError(ErrorCode.USER_NOT_FOUND);
        }

        const valid = await argon2.verify(user.passwordHash, currentPassword);
        if (!valid) {
            throw new CustomError(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        const hash = await argon2.hash(newPassword);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { passwordHash: hash }
            }),
            prisma.session.updateMany({
                where: { userId, revoked: false },
                data: { revoked: true }
            })
        ]);
    }

    static async getUserStats(userId: string) {
        const [
            storiesCount,
            publishedStoriesCount,
            draftStoriesCount,
            pollsCount,
            activePollsCount,
            reportsCount
        ] = await Promise.all([
            prisma.story.count({ where: { authorId: userId } }),
            prisma.story.count({ where: { authorId: userId, published: true } }),
            prisma.story.count({ where: { authorId: userId, storyType: "DRAFT" } }),
            prisma.poll.count({ where: { createdBy: userId } }),
            prisma.poll.count({ where: { createdBy: userId, status: "ACTIVE" } }),
            prisma.report.count({ where: { generatedBy: userId } })
        ]);

        const recentStories = await prisma.story.findMany({
            where: { authorId: userId },
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                published: true,
                status: true,
                storyType: true,
                createdAt: true
            }
        });

        return {
            storiesCount,
            publishedStoriesCount,
            draftStoriesCount,
            pollsCount,
            activePollsCount,
            reportsCount,
            recentStories
        };
    }

    static async getUserActivity(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            prisma.auditLog.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" }
            }),
            prisma.auditLog.count({ where: { userId } })
        ]);

        return {
            activities,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit)
            }
        };
    }
}
