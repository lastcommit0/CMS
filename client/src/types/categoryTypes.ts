
export interface CategoryData {
    id: string;
    name: string;
    description?: string;
    parentId?: string | null;
    isActive: boolean;
}