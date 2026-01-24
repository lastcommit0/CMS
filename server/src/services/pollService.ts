import prisma from '../db';
import CustomError from '../errors/customError';
import { ErrorCode } from '../errors/errorCode';


export class PollService {

    static async list(
        filters: {
            status?: "INACTIVE" | "ACTIVE" | "EXPIRED", 
            storyId?: string}, 
        pagination: { skip: number, take: number }) {
        const where: any = {};
        if(filters.status){
            where.status = filters.status;
        }
        if(filters.storyId){
            where.storyId = filters.storyId;
        }
        const [polls, total] = await Promise.all([
            prisma.poll.findMany({
                where,
                skip: pagination.skip,
                take: pagination.take,
                include: {
                    creator: { 
                        select: { 
                            id: true, 
                            name: true, 
                            email: true 
                        } 
                    },
                    options: {
                        include: {
                            _count: {
                                select: {
                                    votes: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            votes: true
                        }
                    }
                },
                orderBy: { startsAt: 'desc' }
            }),
            prisma.poll.count({
                where
            })
        ]);
        return { polls, total };
    }

    static async getById(id: string) {
        const poll = await prisma.poll.findUnique({
            where: {
                id
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                options: {
                    include: {
                        _count: {
                            select: {
                                votes: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        votes: true
                    }
                }
            }
        });
        if (!poll) {
            throw new CustomError(ErrorCode.POLL_NOT_FOUND);
        }
        return poll;
    }

    static async create(data: any, creatorId: string) {
        if (!data.question || !data.endsAt || !Array.isArray(data.options) || data.options.length < 2) {
            throw new Error("Invalid poll data");
        }
        const startDate = data.startsAt ? new Date(data.startsAt) : new Date();
        const endDate = new Date(data.endsAt);
        if(endDate <= startDate) {
            throw new CustomError(ErrorCode.POLL_EXPIRED);
        }
        let status: "INACTIVE" | "ACTIVE" | "EXPIRED" = "INACTIVE";
        const now = new Date();
        if(now >= startDate && now < endDate){
            status = "ACTIVE";
        }else if(now >= endDate){
            status = "EXPIRED";
        }
        return prisma.poll.create({
            data: {
                question: data.question,
                storyId: data.storyId ?? null,
                startsAt: startDate,
                endsAt: endDate,
                status,
                createdBy: creatorId,
                options: {
                    create: data.options.map((option: any) => ({
                        text: option.text
                    }))
                }
            },
            include: {
                options: true
            }
        });
    }

    static async update(id: string, data: any) {
        return prisma.poll.update({
            where: {
                id
            },
            data: {
                ...data,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
            },
            include: {
                options: true
            }
        });
    }

    static async delete(id: string) {
        return prisma.poll.delete({
            where: {
                id
            }
        });
    }

    static async addOption(pollId: string, data: any) {
        return prisma.pollOption.create({
            data: {
                pollId,
                text: data.text
            }
        });
    }

    static async updateOption(pollId: string, optionId: string, text: string) {
        return prisma.pollOption.update({
            where: {
                id: optionId,
                pollId
            },
            data: {
                text
            }
        });
    }

    static async deleteOption(pollId: string, optionId: string) {
        const count = await prisma.pollOption.count({
            where: {
                id: optionId
            }
        });
        if (count <= 2) {
            throw new CustomError(ErrorCode.POLL_MIN_OPTIONS);
        }
        return prisma.pollOption.deleteMany({
            where: {
                id: optionId,
                pollId
            }
        });
    }

    static async vote(pollId: string, optionId: string, userId?: string, ip?: string) {
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: true
            }
        });
        if (!poll) {
            throw new CustomError(ErrorCode.POLL_NOT_FOUND);
        }
        if (poll.status !== 'ACTIVE') {
            throw new CustomError(ErrorCode.POLL_CLOSED);
        }
        if (poll.endsAt && poll.endsAt < new Date()) {
            throw new CustomError(ErrorCode.POLL_EXPIRED);
        }
        const existingVote = await prisma.pollVote.findFirst({
            where: {
                pollId,
                OR: [
                    ...(userId ? [{ userId }] : []),
                    { ipAddress: ip || '' }
                ]
            }
        });
        if (existingVote) {
            throw new CustomError(ErrorCode.POLL_DUPLICATE_VOTE);
        }
        await prisma.pollVote.create({
            data: {
                pollId,
                optionId: optionId,
                userId: userId,
                ipAddress: ip || ''
            }
        });
        return this.getById(pollId);
    }

    static async getResults(pollId: string) {
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: {
                    include: {
                        _count: {
                            select: {
                                votes: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        votes: true
                    }
                }
            }
        });
        if (!poll) {
            throw new CustomError(ErrorCode.POLL_NOT_FOUND);
        }
        const totalVotes = poll._count.votes;

        return {
            pollId,
            question: poll.question,
            totalVotes,
            options: poll.options.map(o => ({
                id: o.id,
                text: o.text,
                votes: o._count.votes,
                percentage: totalVotes > 0 ? (o._count.votes / totalVotes) * 100 : 0
            }))
        };
    }


    static async expirePolls() {
        return prisma.poll.updateMany({
            where: {
                endsAt: { lt: new Date() },
                status: 'ACTIVE'
            },
            data: {
                status: 'EXPIRED'
            }
        });
    }
}