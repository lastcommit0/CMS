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

    return prisma.$transaction(async (tx) => {
      const assetsInput = Array.isArray(data.assets) ? data.assets : [];
      if (assetsInput.length < 2) {
        throw new CustomError({
          statusCode: 400,
          message: 'Cover image and PDF are required for a story',
          code: 'STORY_ASSETS_REQUIRED'
        });
      }

      const mediaIds = assetsInput.map((asset: any) => asset.mediaId);
      const mediaAssets = await tx.mediaAsset.findMany({
        where: { id: { in: mediaIds } },
        select: { id: true, type: true }
      });

      if (mediaAssets.length !== mediaIds.length) {
        throw new CustomError(ErrorCode.MEDIA_NOT_FOUND);
      }

      const mediaById = new Map(mediaAssets.map((m) => [m.id, m.type]));
      const hasCoverImage = assetsInput.some(
        (asset: any) => asset.isCover && mediaById.get(asset.mediaId) === 'IMAGE'
      );
      const hasPdf = assetsInput.some(
        (asset: any) => mediaById.get(asset.mediaId) === 'PDF'
      );

      if (!hasCoverImage || !hasPdf) {
        throw new CustomError({
          statusCode: 400,
          message: 'Story must include a cover image and a PDF attachment',
          code: 'STORY_ASSETS_REQUIRED'
        });
      }

      const story = await tx.story.create({
        data: {
          title: data.title,
          shortTitle: data.shortTitle,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          highlights: data.highlights,
          storyType: data.storyType,
          status: data.status,
          priority: data.priority ?? 0,
          scheduleAt: data.scheduleAt ? new Date(data.scheduleAt) : undefined,
          authorId,
          mandal: data.mandal,
          district: data.district,
          place: data.place,
          photoCaption: data.photoCaption,
          photoCredit: data.photoCredit,
          sections: data.sectionIds
            ? { create: data.sectionIds.map((id: string) => ({ sectionId: id })) }
            : undefined,
          meta: data.metaTags ? { create: data.metaTags } : undefined,
          assets: {
            create: assetsInput.map((asset: any, index: number) => ({
              mediaId: asset.mediaId,
              isCover: !!asset.isCover,
              order: asset.order ?? index,
            }))
          }
        },
        include: {
          sections: { include: { section: true } },
          meta: true
        }
      });

      // Initial version
      await tx.storyVersion.create({
        data: {
          storyId: story.id,
          content: story.content as any,
          editedBy: authorId,
          reason: 'Initial creation'
        }
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: authorId,
          action: 'STORY_CREATED',
          resource: 'Story',
          metadata: { storyId: story.id, status: story.status },
          ipAddress: 'system'
        }
      });

      return story;
    });
  }

  static async update(id: string, data: any, userId?: string) {
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

    return prisma.$transaction(async (tx) => {
      const story = await tx.story.update({
        where: { id },
        data: {
          title: data.title,
          shortTitle: data.shortTitle,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          highlights: data.highlights,
          storyType: data.storyType,
          status: data.status,
          priority: data.priority ?? 0,
          scheduleAt: data.scheduleAt ? new Date(data.scheduleAt) : undefined,
          mandal: data.mandal,
          district: data.district,
          place: data.place,
          photoCaption: data.photoCaption,
          photoCredit: data.photoCredit,
          sections: data.sectionIds
            ? { create: data.sectionIds.map((sid: string) => ({ sectionId: sid })) }
            : undefined,
          meta: data.metaTags
            ? { upsert: { create: data.metaTags, update: data.metaTags } }
            : undefined
        },
        include: {
          sections: { include: { section: true } },
          meta: true
        }
      });

      if (userId) {
        // Create version on update if userId is provided
        await tx.storyVersion.create({
          data: {
            storyId: story.id,
            content: story.content as any,
            editedBy: userId,
            reason: 'Manual update'
          }
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: userId,
            action: 'STORY_UPDATED',
            resource: 'Story',
            metadata: { storyId: story.id },
            ipAddress: 'system'
          }
        });
      }

      return story;
    });
  }

  static async delete(id: string) {
    return prisma.story.delete({ where: { id } });
  }

  static async stats() {
    const [published, pendingReview, submitted, scheduled, rejected, unpublished, changesRequested] = await Promise.all([
      prisma.story.count({ where: { status: 'PUBLISHED' } }),
      prisma.story.count({ where: { status: 'REVIEW' } }),
      prisma.story.count({ where: { status: 'SUBMITTED' } }),
      prisma.story.count({ where: { status: 'SCHEDULED' } }),
      prisma.story.count({ where: { status: 'REJECTED' } }),
      prisma.story.count({ where: { status: 'UNPUBLISHED' } }),
      prisma.story.count({ where: { status: 'CHANGES_REQUESTED' } }),
    ]);
    console.log(published, pendingReview, submitted, scheduled, rejected, unpublished, changesRequested);
    return {
      published,
      pending: pendingReview + submitted,
      planned: scheduled,
      holdReject: rejected + unpublished + changesRequested
    };
  }

  static async addAsset(storyId: string, data: any) {
    const media = await prisma.mediaAsset.findUnique({
      where: { id: data.mediaId },
      select: { id: true, type: true }
    });

    if (!media) {
      throw new CustomError(ErrorCode.MEDIA_NOT_FOUND);
    }

    if (data.isCover && media.type !== 'IMAGE') {
      throw new CustomError({
        statusCode: 400,
        message: 'Cover asset must be an image',
        code: 'STORY_ASSET_INVALID_TYPE'
      });
    }

    return prisma.storyAsset.create({
      data: {
        storyId,
        mediaId: data.mediaId,
        isCover: !!data.isCover,
        order: data.order ?? 0,
      }
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
