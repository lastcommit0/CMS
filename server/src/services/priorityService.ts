import prisma from '../db';
import CustomError from '../errors/customError';
import { ErrorCode } from '../errors/errorCode';

export class PriorityService {
  static async getPriorities(sectionId?: string, search?: string) {
    const where: any = sectionId ? { sectionId } : {};

    if (search) {
      where.story = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    return prisma.storySection.findMany({
      where,
      include: {
        story: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            author: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        section: { select: { id: true, name: true, slug: true } }
      },
      orderBy: { priority: 'desc' }
    });
  }

  static async updatePriority(
    storyId: string,
    sectionId: string,
    priority: number,
    userId: string
  ) {
    const ss = await prisma.storySection.findFirst({
      where: { storyId, sectionId }
    });

    if (!ss) {
      throw new CustomError(ErrorCode.PRIORITY_INVALID_ZONE);
    }

    await prisma.priorityLog.create({
      data: {
        storyId,
        sectionId,
        oldPriority: ss.priority,
        newPriority: priority,
        changedById: userId
      }
    });

    return prisma.storySection.update({
      where: { id: ss.id },
      data: { priority }
    });
  }

  static async bulkUpdate(updates: any[], userId: string, ip: string) {
    for (const u of updates) {
      const ss = await prisma.storySection.findFirst({
        where: { storyId: u.storyId, sectionId: u.sectionId }
      });

      if (!ss) continue;

      await prisma.priorityLog.create({
        data: {
          storyId: u.storyId,
          sectionId: u.sectionId,
          oldPriority: ss.priority,
          newPriority: u.priority,
          changedById: userId
        }
      });

      await prisma.storySection.update({
        where: { id: ss.id },
        data: { priority: u.priority }
      });
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PRIORITIES_BULK_UPDATE',
        resource: 'StorySection',
        metadata: { count: updates.length },
        ipAddress: ip
      }
    });


  }

  static async getLogs(page: number, limit: number, filters: any) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.priorityLog.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { changedAt: 'desc' }
      }),
      prisma.priorityLog.count({ where: filters })
    ]);

    return { logs, total };
  }
}
