import prisma from "../db";

export class ContactService {
    static async getMessages(params: { page?: number; limit?: number; search?: string }) {
        const { page = 1, limit = 10, search } = params;
        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
                { message: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        const [messages, total] = await Promise.all([
            prisma.contactMessage.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.contactMessage.count({ where }),
        ]);

        return {
            messages,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    static async deleteMessage(id: string) {
        return prisma.contactMessage.delete({
            where: { id },
        });
    }
}
