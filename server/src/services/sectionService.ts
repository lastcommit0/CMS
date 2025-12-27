import prisma from "../db";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";

export const SectionService = {
  async getAll(params: any) {
    const { page, limit, search, isActive } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, total] = await Promise.all([
      prisma.section.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { stories: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.section.count({ where })
    ]);

    return { data, total };
  },

  async getById(id: string) {
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        stories: {
          include: {
            story: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                published: true
              }
            }
          },
          orderBy: { priority: 'desc' }
        },
        _count: { select: { stories: true } }
      }
    });

    if (!section) {
      throw new CustomError(ErrorCode.SECTION_NOT_FOUND);
    }

    return section;
  },

  async create(userId: string, ip: string, data: any) {
    const slugExists = await prisma.section.findUnique({
      where: { slug: data.slug }
    });

    if (slugExists) {
      throw new CustomError(ErrorCode.SECTION_SLUG_DUPLICATE);
    }

    const section = await prisma.section.create({
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive ?? true
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SECTION_CREATED',
        resource: 'Section',
        metadata: { sectionId: section.id },
        ipAddress: ip
      }
    });

    return section;
  },

  async update(userId: string, ip: string, id: string, data: any) {
    if (data.slug) {
      const slugExists = await prisma.section.findFirst({
        where: { slug: data.slug, id: { not: id } }
      });

      if (slugExists) {
        throw new CustomError(ErrorCode.SECTION_SLUG_DUPLICATE);
      }
    }

    const section = await prisma.section.update({
      where: { id },
      data
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SECTION_UPDATED',
        resource: 'Section',
        metadata: { sectionId: id, changes: data },
        ipAddress: ip
      }
    });

    return section;
  },

  async delete(userId: string, ip: string, id: string) {
    const count = await prisma.storySection.count({
      where: { sectionId: id }
    });

    if (count > 0) {
      throw new CustomError(ErrorCode.SECTION_HAS_STORIES);
    }

    await prisma.section.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SECTION_DELETED',
        resource: 'Section',
        metadata: { sectionId: id },
        ipAddress: ip
      }
    });
  },

  async addStory(userId: string, ip: string, sectionId: string, data: any) {
    const exists = await prisma.storySection.findFirst({
      where: { sectionId, storyId: data.storyId }
    });

    if (exists) {
      throw new CustomError(ErrorCode.SYSTEM_VALIDATION_ERROR);
    }

    const record = await prisma.storySection.create({
      data: {
        sectionId,
        storyId: data.storyId,
        priority: data.priority ?? 0,
        isFeatured: data.isFeatured ?? false
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'STORY_ADDED_TO_SECTION',
        resource: 'StorySection',
        metadata: { sectionId, storyId: data.storyId },
        ipAddress: ip
      }
    });

    return record;
  },

  async removeStory(userId: string, ip: string, sectionId: string, storyId: string) {
    const exist = await prisma.storySection.findFirst({
      where: {
        sectionId,
        storyId
      }
    });
    if (!exist) {
      throw new CustomError(ErrorCode.STORY_NOT_FOUND);
    }

    await prisma.storySection.deleteMany({
      where: {
        storyId,
        sectionId
      }
    });
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'STORY_REMOVED_FROM_SECTION',
        resource: 'StorySection',
        metadata: { sectionId, storyId },
        ipAddress: ip
      }
    });
  },

  async getFeatured(sectionId: string,) {
    const stories = await prisma.storySection.findMany({
      where: {
        sectionId,
        isFeatured: true
      },
      include: {
        story: true
      },
      orderBy: {
        priority: 'desc'
      }
    });
    return stories;
  },

  async setFeatured(userId: string, ip: string, sectionId: string, storyId: string, isFeatured: boolean) {
    const record = await prisma.storySection.findFirst({
      where: { sectionId, storyId }
    });

    if (!record) {
      throw new CustomError(ErrorCode.STORY_NOT_FOUND);
    }

    const updated = await prisma.storySection.update({
      where: { id: record.id },
      data: { isFeatured }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'STORY_FEATURED_STATUS_UPDATED',
        resource: 'StorySection',
        metadata: { sectionId, storyId, isFeatured },
        ipAddress: ip
      }
    });

    return updated;
  },


  async getSectionStats(sectionId: string) {
    const stories = await prisma.storySection.findMany({
      where: { sectionId },
      select: {
        isFeatured: true,
        story: {
          select: {
            published: true,
            storyType: true
          }
        }
      }
    });
    const totalStories = stories.length;
    const featuredStories = stories.filter(s => s.isFeatured).length;
    const publishedStories = stories.filter(s => s.story?.published).length;
    const draftStories = stories.filter(s => s.story?.storyType === 'DRAFT').length;


    return { totalStories, featuredStories, publishedStories, draftStories };
  }
};
