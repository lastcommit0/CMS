import { date } from "zod";
import prisma from "../db";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";


export class AuditService {

    static async getAuditLogs(filter: any) {
        const { page, limit, userId, action, resource, dateFrom, dateTo } = filter;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (userId) {
            where.userId = userId;
        }
        if (action) {
            where.action = { contains: action, mode: 'insensitive' };
        }
        if (resource) {
            where.resource = resource;
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = new Date(dateFrom);
            }
            if (dateTo) {
                where.createdAt.lte = new Date(dateTo);
            }
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            roles: true
                        }
                    }
                }
            }),
            prisma.auditLog.count({ where })
        ]);
        const totalPages = Math.ceil(total / limit);
        return { logs, total, page, limit, totalPages };
    }

    static async fetchAuditLogById(id: string) {
        return await prisma.auditLog.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        roles: true
                    }
                }
            }
        });
    }

    static async fetchTimeline(filters: any) {
        const where: any = {};
        if (filters.userId) {
            where.userId = filters.userId;
        }
        if (filters.resource) {
            where.resource = filters.resource;
        }
        const logs = await prisma.auditLog.findMany({
            where,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        roles: true
                    }
                }
            }
        });
        return logs;
    }

    static async fetchAuditStats(dateFrom: Date, dateTo: Date) {
        const where = {
            createdAt: {
                gte: dateFrom,
                lte: dateTo,
            },
        };

        const [totalLogs, byAction, byResource, topUsers] =
            await Promise.all([
                prisma.auditLog.count({ where }),

                prisma.auditLog.groupBy({
                    by: ["action"],
                    where,
                    _count: {
                        _all: true,
                    },
                    orderBy: {
                        _count: {
                            id: "desc",
                        },
                    }

                }),

                prisma.auditLog.groupBy({
                    by: ["resource"],
                    where,
                    _count: {
                        _all: true,
                    },
                    orderBy: {
                        _count: {
                            id: "desc",
                        },
                    }
                }),

                prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        _count: {
                            select: {
                                auditLogs: true,
                            },
                        },
                    },
                    orderBy: {
                        auditLogs: {
                            _count: "desc",
                        },
                    },
                    take: 10,
                }),
            ]);

        return {
            period: { from: dateFrom, to: dateTo },
            totalLogs,
            byAction: byAction.map(a => ({
                action: a.action,
                count: a._count._all,
            })),
            byResource: byResource.map(r => ({
                resource: r.resource,
                count: r._count._all,
            })),
            topUsers: topUsers.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                totalActions: u._count.auditLogs,
            })),
        };
    }


    static async logAudit({
        userId,
        action,
        resource = 'Auth',
        metadata,
        ipAddress,
    }: {
        userId?: string;
        action: string;
        resource: string;
        metadata?: any;
        ipAddress?: string;
    }) {
        await prisma.auditLog.create({
            data: {
                userId: userId || 'unknown',
                action,
                resource,
                metadata,
                ipAddress: ipAddress || 'unknown',
            },
        });
    }
}




// type AuditAction = 'USER_CREATED' | 'USER_LOGIN' | 'USER_LOGOUT' | 'USER_REFRESH' | 'USER_LOGIN_FAILED' | 'USER_REFRESH_FAILED' | 'USER_LOGOUT_ALL';



// export async function logAudit({
//     userId,
//     action,
//     resource = 'Auth',
//     metadata,
//     ipAddress,
// }: {
//     userId?: string;
//     action: string;
//     resource: string;
//     metadata?: any;
//     ipAddress?: string;
// }) {
//     await prisma.auditLog.create({
//         data: {
//             userId: userId || 'unknown',
//             action,
//             resource,
//             metadata,
//             ipAddress: ipAddress || 'unknown',
//         },
//     });
// }

