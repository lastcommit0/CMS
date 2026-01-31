import prisma from '../db';
import CustomError from '../errors/customError';
import { ErrorCode } from '../errors/errorCode';

export class StoryService {

  static async listStories(filters: any, pagination: any) {
    const { skip, take } = pagination;

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where: filters,
        skip,
        take,
        include: {
          author: { select: { id: true, name: true, email: true } },
          sections: { include: { section: true } },
          assets: true,
          meta: true,
          _count: { select: { assets: true } }
        },
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.story.count({ where: filters })
    ]);

    return { stories, total };
  }

  static async getById(id: string) {
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true }, include: { profile: true } },
        sections: { include: { section: true } },
        assets: true,
        meta: true
      }
    });

    if (!story) {
      throw new CustomError(ErrorCode.STORY_NOT_FOUND);
    }

    return story;
  }

  static async create(data: any, authorId: string) {
    const slugExists = await prisma.story.findUnique({ where: { slug: data.slug } });
    if (slugExists) {
      throw new CustomError(ErrorCode.STORY_SLUG_CONFLICT);
    }

    return prisma.story.create({
      data: {
        ...data,
        priority: data.priority ?? 0,
        scheduleAt: data.scheduleAt ? new Date(data.scheduleAt) : undefined,
        authorId,
        sections: data.sectionIds
          ? { create: data.sectionIds.map((id: string) => ({ sectionId: id })) }
          : undefined,
        metaTags: data.metaTags ? { create: data.metaTags } : undefined
      },
      include: {
        sections: { include: { section: true } },
        meta: true
      }
    });
  }

  static async update(id: string, data: any) {
    if (data.slug) {
      const exists = await prisma.story.findFirst({
        where: { slug: data.slug, id: { not: id } }
      });
      if (exists) {
        throw new CustomError(ErrorCode.STORY_SLUG_CONFLICT);
      }
    }

    if (data.sectionIds) {
      await prisma.storySection.deleteMany({ where: { storyId: id } });
    }

    return prisma.story.update({
      where: { id },
      data: {
        ...data,
        scheduleAt: data.scheduleAt ? new Date(data.scheduleAt) : undefined,
        sections: data.sectionIds
          ? { create: data.sectionIds.map((sid: string) => ({ sectionId: sid })) }
          : undefined,
        metaTags: data.metaTags
          ? { upsert: { create: data.metaTags, update: data.metaTags } }
          : undefined
      },
      include: {
        sections: { include: { section: true } },
        meta: true
      }
    });
  }

  static async delete(id: string) {
    return prisma.story.delete({ where: { id } });
  }

  // static async publish(id: string) {
  //   return prisma.story.update({
  //     where: { id },
  //     data: { status: 'PUBLISHED' }
  //   });
  // }

  // static async hold(id: string) {
  //   return prisma.story.update({
  //     where: { id },
  //     data: { status: 'DRAFT' }
  //   });
  // }

  // static async schedule(id: string, scheduleAt: string) {
  //   return prisma.story.update({
  //     where: { id },
  //     data: { scheduleAt: new Date(scheduleAt), status: 'SCHEDULED' }
  //   });
  // }

  // static async pending(id: string){
  //   return prisma.story.update({
  //     where: { id },
  //     data: { status: 'REVIEW' }
  //   });
  // }

  static async stats(){
    const [published, pending, planned, holdReject] = await Promise.all([
      prisma.story.count({ where: { status: 'PUBLISHED' } }),
      prisma.story.count({ where: { status: 'REVIEW' } }),
      prisma.story.count({ where: { status: 'SCHEDULED' } }),
      prisma.story.count({ where: { status: 'REVIEW'} })
    ]);
  }

  static async addAsset(storyId: string, data: any) {
    return prisma.storyAsset.create({
      data: { storyId, ...data }
    });
  }

  static async deleteAsset(storyId: string, assetId: string) {
    return prisma.storyAsset.delete({
      where: { id: assetId, storyId }
    });
  }

  static async bulkUpdate(ids: string[], data: any) {
    return prisma.story.updateMany({
      where: { id: { in: ids } },
      data
    });
  }

  static async bulkDelete(ids: string[]) {
    return prisma.story.deleteMany({
      where: { id: { in: ids } }
    });
  }
}
