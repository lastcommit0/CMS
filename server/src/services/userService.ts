import { Prisma } from '../generated/prisma/client';
import prisma from "../db";
import CustomError from "../errors/customError";
import argon2 from "argon2";
import { ErrorCode } from "../errors/errorCode";
import { getManagerId } from "../utils/managerId";

export class UserService {
    static async getCurrentUser(userId: string) {
        return this.getUserById(userId);
    }

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
        if (status) where.status = status;
        // Role filtering would need to be handled carefully in raw query or pre-filtered

        let users: any[];
        let total: number;

        if (search) {
            const searchTerm = `%${search}%`;
            // Using raw SQL for relevance sorting via ILIKE and similarity
            users = await prisma.$queryRaw`
                SELECT u.*, p.*, 
                (similarity(u.name, ${search}) * 2 + similarity(u.email, ${search})) as relevance
                FROM "User" u
                LEFT JOIN "UserProfile" p ON u.id = p."userId"
                WHERE (u.name ILIKE ${searchTerm} OR u.email ILIKE ${searchTerm} OR u.phone ILIKE ${searchTerm})
                ${status ? Prisma.sql`AND u.status = ${status}` : Prisma.empty}
                ORDER BY relevance DESC
                LIMIT ${limit} OFFSET ${skip}
            `;

            const countResult: any[] = await prisma.$queryRaw`
                SELECT COUNT(*)::int as count FROM "User" u
                WHERE (u.name ILIKE ${searchTerm} OR u.email ILIKE ${searchTerm} OR u.phone ILIKE ${searchTerm})
                ${status ? Prisma.sql`AND u.status = ${status}` : Prisma.empty}
            `;
            total = countResult[0].count;
        } else {
            [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        profile: true,
                        roles: { include: { role: true } },
                        manager: { select: { id: true, name: true, email: true } },
                        _count: { select: { stories: true, subordinates: true } }
                    },
                    orderBy: { createdAt: "desc" }
                }),
                prisma.user.count({ where })
            ]);
        }

        const sanitizedUsers = users.map((u: any) => {
            const { passwordHash, ...sanitized } = u;
            return sanitized;
        });

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
                roles: {
                    include: {
                        role: true
                    }
                },
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

    static async updateUser(
        userId: string,
        data: any,
        updatedById?: string,
        ipAddress?: string
    ) {
        // Check if email or phone already exists
        if (data.email || data.phone) {
            const exist = await prisma.user.findFirst({
                where: {
                    id: { not: userId },
                    OR: [
                        ...(data.email ? [{ email: data.email }] : []),
                        ...(data.phone ? [{ phone: data.phone }] : [])
                    ]
                }
            });

            if (exist) {
                if (exist.email === data.email) {
                    throw new CustomError(ErrorCode.USER_EMAIL_EXISTS);
                }
                if (exist.phone === data.phone) {
                    throw new CustomError(ErrorCode.USER_PHONE_EXISTS);
                }
            }
        }

        let passwordHash: string | undefined;
        if (data.password) {
            passwordHash = await argon2.hash(data.password);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                managerId: data.managerId || null,
                ...(passwordHash && { passwordHash }),

                profile: {
                    upsert: {
                        update: {
                            designation: data.designation,
                            jobType: data.jobType,
                            location: data.location,
                            bio: data.bio,
                            avatar: data.avatar,
                        },
                        create: {
                            designation: data.designation || "COPY_EDITOR",
                            jobType: data.jobType || "FULL_TIME",
                            location: data.location,
                            bio: data.bio,
                            avatar: data.avatar,
                        }
                    }
                }
            },
            include: {
                profile: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (updatedById) {
            await prisma.auditLog.create({
                data: {
                    userId: updatedById,
                    action: "USER_UPDATED",
                    resource: "USER",
                    metadata: {
                        targetUserId: userId,
                        email: user.email
                    },
                    ipAddress: ipAddress || "unknown",
                }
            });
        }

        const { passwordHash: _, ...sanitized } = user;
        return sanitized;
    }

    static async deleteUser(targetUserId: string, performedByUserId: string) {
        if (targetUserId === performedByUserId) {
            throw new CustomError(ErrorCode.USER_CANNOT_DELETE_SELF);
        }

        await prisma.user.delete({ where: { id: targetUserId } });
    }

    static async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || !user.passwordHash) {
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
            prisma.story.count({ where: { authorId: userId, status: "PUBLISHED" } }),
            prisma.story.count({ where: { authorId: userId, status: "DRAFT" } }),
            prisma.poll.count({ where: { createdBy: userId } }),
            prisma.poll.count({ where: { createdBy: userId, status: "ACTIVE" } }),
            prisma.report.count({ where: { generatedBy: userId } })
        ]);

        const recentStories = await prisma.story.findMany({
            where: { authorId: userId },
            take: 5,
            orderBy: { publishedAt: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                storyType: true,
                publishedAt: true
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

    static async getManager(role: string) {
        const allowedRoles = getManagerId(role);
        if (allowedRoles.length === 0) return [];

        const managers = await prisma.user.findMany({
            where: {
                status: "ACTIVE",
                roles: {
                    some: {
                        role: {
                            name: {
                                in: allowedRoles as any[]
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        return managers;
    }
}
