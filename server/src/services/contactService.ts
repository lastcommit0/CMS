import prisma from "../db";

export class ContactService {
    static async getMessages(params: { page?: number; limit?: number; search?: string }) {
        const { page = 1, limit = 10, search } = params;
        const skip = (page - 1) * limit;

        let messages: any[];
        let total: number;

        if (search) {
            const searchTerm = `%${search}%`;
            messages = await prisma.$queryRaw`
                SELECT *, 
                (similarity(name, ${search}) * 2 + similarity(message, ${search})) as relevance
                FROM "ContactMessage"
                WHERE (name ILIKE ${searchTerm} OR email ILIKE ${searchTerm} OR message ILIKE ${searchTerm})
                ORDER BY relevance DESC
                LIMIT ${limit} OFFSET ${skip}
            `;
            const countResult: any[] = await prisma.$queryRaw`
                SELECT COUNT(*)::int as count FROM "ContactMessage"
                WHERE (name ILIKE ${searchTerm} OR email ILIKE ${searchTerm} OR message ILIKE ${searchTerm})
            `;
            total = countResult[0].count;
        } else {
            const where = {};
            [messages, total] = await Promise.all([
                prisma.contactMessage.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.contactMessage.count({ where }),
            ]);
        }

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
