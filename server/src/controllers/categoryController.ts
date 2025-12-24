import { Request, Response } from 'express';
import prisma from '../db';
import {
    createCategorySchema,
    updateCategorySchema,
    categoryListSchema,
    bulkUpdateCategorySchema,
    bulkDeleteCategorySchema
} from '../validators/categorySchema';
import { CategoryService } from '../services/categoryService';

export const getCategories = async (req: Request, res: Response) => {
    const { page, limit, search, isActive, parentId } =
        categoryListSchema.parse(req.query);

    const filters: any = {};

    if (search) {
        filters.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (parentId === 'null') filters.parentId = null;
    else if (parentId) filters.parentId = parentId;

    const result = await CategoryService.list(filters, {
        skip: (page - 1) * limit,
        take: limit
    });

    res.json({
        success: true,
        data: result.categories,
        pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        }
    });
};

export const getCategoryById = async (req: Request, res: Response) => {
    const category = await CategoryService.getById(req.params.id);
    res.json({ success: true, data: category });
};

export const createCategory = async (req: Request, res: Response) => {
    const data = createCategorySchema.parse(req.body);
    const category = await CategoryService.create(data);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'CATEGORY_CREATED',
            resource: 'Category',
            metadata: { categoryId: category.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.status(201).json({ success: true, data: category });
};

export const updateCategory = async (req: Request, res: Response) => {
    const data = updateCategorySchema.parse(req.body);
    const category = await CategoryService.update(req.params.id, data);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'CATEGORY_UPDATED',
            resource: 'Category',
            metadata: { categoryId: req.params.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true, data: category });
};

export const deleteCategory = async (req: Request, res: Response) => {
    await CategoryService.delete(req.params.id);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: 'CATEGORY_DELETED',
            resource: 'Category',
            metadata: { categoryId: req.params.id },
            ipAddress: req.ip || 'unknown'
        }
    });

    res.json({ success: true });
};

export const getTree = async (_req: Request, res: Response) => {
    const tree = await CategoryService.getTree();
    res.json({ success: true, data: tree });
};

export const bulkUpdate = async (req: Request, res: Response) => {
    const { categoryIds, isActive } = bulkUpdateCategorySchema.parse(req.body);
    await CategoryService.bulkUpdate(categoryIds, isActive);

    res.json({ success: true });
};

export const bulkDelete = async (req: Request, res: Response) => {
    const { categoryIds } = bulkDeleteCategorySchema.parse(req.body);
    await CategoryService.bulkDelete(categoryIds);

    res.json({ success: true });
};
