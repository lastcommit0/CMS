import prisma from '../db';
import CustomError from '../errors/customError';
import { ErrorCode } from '../errors/errorCode';

export class CategoryService {

  static async list(filters: any, pagination: { skip: number; take: number }) {
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: filters,
        skip: pagination.skip,
        take: pagination.take,
        include: {
          parent: { select: { id: true, name: true, slug: true } },
          _count: { select: { subcategories: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.category.count({ where: filters })
    ]);

    return { categories, total };
  }

  static async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { parent: true, subcategories: true }
    });

    if (!category) {
      throw new CustomError(ErrorCode.CATEGORY_NOT_FOUND);
    }

    return category;
  }

  static async create(data: any) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: data.slug }
    });

    if (slugExists) {
      throw new CustomError(ErrorCode.CATEGORY_SLUG_DUPLICATE);
    }

    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId }
      });
      if (!parent) {
        throw new CustomError(ErrorCode.CATEGORY_PARENT_INVALID);
      }
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId ?? null,
        isActive: data.isActive ?? true
      },
      include: { parent: true }
    });
  }

  static async update(id: string, data: any) {
    if (data.slug) {
      const exists = await prisma.category.findFirst({
        where: { slug: data.slug, id: { not: id } }
      });
      if (exists) {
        throw new CustomError(ErrorCode.CATEGORY_SLUG_DUPLICATE);
      }
    }

    if (data.parentId) {
      if (data.parentId === id) {
        throw new CustomError(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
      }

      const parent = await prisma.category.findUnique({
        where: { id: data.parentId }
      });

      if (!parent) {
        throw new CustomError(ErrorCode.CATEGORY_PARENT_INVALID);
      }

      const isDescendant = await this.isDescendant(id, data.parentId);
      if (isDescendant) {
        throw new CustomError(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
      }
    }

    return prisma.category.update({
      where: { id },
      data,
      include: { parent: true, subcategories: true }
    });
  }

  static async delete(id: string) {
    const childrenCount = await prisma.category.count({
      where: { parentId: id }
    });

    if (childrenCount > 0) {
      throw new CustomError(ErrorCode.CATEGORY_HAS_CHILDREN);
    }

    return prisma.category.delete({ where: { id } });
  }

  static async getTree() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        subcategories: {
          include: {
            subcategories: {
              include: { subcategories: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  static async bulkUpdate(categoryIds: string[], isActive: boolean) {
    return prisma.category.updateMany({
      where: { id: { in: categoryIds } },
      data: { isActive }
    });
  }

  static async bulkDelete(categoryIds: string[]) {
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      include: { _count: { select: { subcategories: true } } }
    });

    if (categories.some(c => c._count.subcategories > 0)) {
      throw new CustomError(ErrorCode.CATEGORY_HAS_CHILDREN);
    }

    return prisma.category.deleteMany({
      where: { id: { in: categoryIds } }
    });
  }

  private static async isDescendant(parentId: string, childId: string): Promise<boolean> {
    const children = await prisma.category.findMany({
      where: { parentId }
    });

    for (const child of children) {
      if (child.id === childId) return true;
      if (await this.isDescendant(child.id, childId)) return true;
    }

    return false;
  }
}
