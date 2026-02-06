import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/services/categoryService";
import type { CategoryData, CategoryFilters } from "@/types/categoryTypes";
import { toast } from "sonner";

const CATEGORY_KEYS = {
  all: ["categories"] as const,
  list: (filters: CategoryFilters) => ["categories", "list", filters] as const,
  tree: ["categories", "tree"] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export const useCategories = (filters: CategoryFilters) => {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(filters),
    queryFn: async () => {
      const res = await categoryApi.list(filters);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.tree,
    queryFn: async () => {
      const res = await categoryApi.tree();
      return res.data.data || [];
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<CategoryData, "name" | "slug" | "parentId" | "isActive">>;
    }) => {
      const res = await categoryApi.update(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || "Failed to update category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await categoryApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category deleted");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || "Failed to delete category");
    },
  });
};
