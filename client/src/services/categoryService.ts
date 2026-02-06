import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import { CATEGORY_URL } from "@/lib/config";
import type { CategoryData, CategoryFilters } from "@/types/categoryTypes";

export const categoryApi = {
  list: (filters: CategoryFilters) =>
    apiClient.get<
      ApiResponse<CategoryData[]> & {
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }
    >(`${CATEGORY_URL}/categories`, { params: filters }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<CategoryData>>(`${CATEGORY_URL}/category/${id}`),

  create: (data: Pick<CategoryData, "name" | "slug" | "parentId" | "isActive">) =>
    apiClient.post<ApiResponse<CategoryData>>(`${CATEGORY_URL}/category`, data),

  update: (id: string, data: Partial<Pick<CategoryData, "name" | "slug" | "parentId" | "isActive">>) =>
    apiClient.post<ApiResponse<CategoryData>>(`${CATEGORY_URL}/category/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${CATEGORY_URL}/category/${id}`),

  tree: () =>
    apiClient.get<ApiResponse<CategoryData[]>>(`${CATEGORY_URL}/category/tree`),

  bulkUpdate: (categoryIds: string[], isActive: boolean) =>
    apiClient.post(`${CATEGORY_URL}/category/bulk`, { categoryIds, isActive }),

  bulkDelete: (categoryIds: string[]) =>
    apiClient.delete(`${CATEGORY_URL}/category/bulk`, { data: { categoryIds } }),
};
