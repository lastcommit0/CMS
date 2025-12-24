import prisma from '../db';
import CustomError from '../errors/customError';
import { ErrorCode } from '../errors/errorCode';

export class MetaService {
  static async getMetaTags(storyId: string) {
    const meta = await prisma.metaTag.findFirst({ where: { storyId } });

    if (!meta) {
      throw new CustomError(ErrorCode.META_REQUIRED_MISSING);
    }

    return meta;
  }

  static async upsertMetaTags(
    storyId: string,
    data: any,
    userId: string,
    ip: string
  ) {
    const story = await prisma.story.findUnique({ where: { id: storyId } });

    if (!story) {
      throw new CustomError(ErrorCode.STORY_NOT_FOUND);
    }

    const meta = await prisma.metaTag.upsert({
      where: { storyId },
      update: data,
      create: { storyId, ...data }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'META_TAGS_UPDATED',
        resource: 'MetaTag',
        metadata: { storyId, metaTagId: meta.id },
        ipAddress: ip
      }
    });

    return meta;
  }

  static async bulkGenerate(storyIds: string[], userId: string, ip: string) {
    const stories = await prisma.story.findMany({
      where: { id: { in: storyIds } },
      include: { metaTags: true }
    });

    const payload = stories
      .filter(s => !s.metaTags)
      .map(s => ({
        storyId: s.id,
        metaDescription: s.excerpt,
        metaKeywords: s.title,
        ogTitle: s.title,
        ogDescription: s.excerpt
      }));

    if (!payload.length) {
      throw new CustomError(ErrorCode.META_DUPLICATE);
    }

    await prisma.metaTag.createMany({ data: payload, skipDuplicates: true });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'META_TAGS_BULK_GENERATED',
        resource: 'MetaTag',
        metadata: { count: payload.length },
        ipAddress: ip
      }
    });

    return payload.length;
  }
}
