
export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  isActive: boolean;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count?: {
    subcategories: number;
  };
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: "true" | "false";
  parentId?: string;
}
