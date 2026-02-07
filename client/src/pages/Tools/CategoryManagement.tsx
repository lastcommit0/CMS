import { Input } from "@/components/ui/input";
import { SquarePen, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import EditCategory from "./components/EditCategory";
import { useCategories } from "@/hooks/useCategories";
import type { CategoryData } from "@/types/categoryTypes";


export default function CategoryManagement() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [searchEng, setSearchEng] = useState("");
  const [searchHindi, setSearchHindi] = useState("");
  const [searchFolder, setSearchFolder] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">("all");
  const [parentFilter, setParentFilter] = useState<string>("all");

  const isActiveFilter = statusFilter === "all" ? undefined : statusFilter;

  const { data: listResponse, isLoading, isError } = useCategories({
    page: 1,
    limit: 50,
    search: searchEng || undefined,
    isActive: isActiveFilter as any,
    parentId: parentFilter === "all" ? undefined : parentFilter,
  });

  const categories: CategoryData[] = (listResponse as any)?.data || [];
  const parentOptions = useMemo(
    () =>
      categories.map((cat: CategoryData) => ({
        value: cat.id,
        label: cat.name,
      })),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    const normalizedHindi = searchHindi.trim().toLowerCase();
    const normalizedFolder = searchFolder.trim().toLowerCase();

    return categories.filter((cat: CategoryData) => {
      const name = cat.name.toLowerCase();
      const parentName = cat.parent?.name?.toLowerCase() || "root";

      if (normalizedHindi && !name.includes(normalizedHindi)) return false;
      if (normalizedFolder && !parentName.includes(normalizedFolder)) return false;
      return true;
    });
  }, [categories, searchHindi, searchFolder]);

  const openModal = (category: CategoryData) => {
    setSelectedCategory(category);
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  }


  return (
    <div className="w-full min-h-screen bg-white">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-[18px] font-semibold text-[#243874]">
          Category Management
        </h1>
      </header>
      <div className="p-4 md:p-6">
        <div className="bg-white border rounded-md overflow-hidden">
          <table className="min-w-[700px] w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr className="">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-center">Category Name (Eng)</th>
                <th className="px-4 py-3 text-center">Category Name (Hindi)</th>
                <th className="px-6 py-3 text-left">Folder</th>
                <th className="px-4 py-3 text-left">Is Parent</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-center">
                  <FilterInput value={searchEng} onChange={setSearchEng} />
                </th>
                <th className="px-4 py-3 text-center">
                  <FilterInput value={searchHindi} onChange={setSearchHindi} />
                </th>
                <th className="px-4 py-3 text-center">
                  <FilterInput value={searchFolder} onChange={setSearchFolder} />
                </th>
                <th className="px-4 py-3 text-center">
                  <SelectField
                    value={parentFilter}
                    options={[
                      { label: "All", value: "all" },
                      ...parentOptions,
                    ]}
                    onChange={(val) => setParentFilter(val)}
                  />
                </th>
                <th className="px-4 py-3 text-center">
                  <SelectField
                    value={statusFilter}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Active", value: "true" },
                      { label: "Inactive", value: "false" },
                    ]}
                    onChange={(val) => setStatusFilter(val as any)}
                  />
                </th>
                <th className="px-4 py-3 text-center text-green-400"><Check></Check></th>

              </tr>
            </thead>

            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-red-500">
                    Failed to load categories
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category: CategoryData) => (
                  <tr key={category.id} className="text-sm text-gray-700">
                    {/* Priority */}

                    {/* ID */}
                    <td className="px-4 py-4">{category.id}</td>

                    {/* Author */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-center gap-2">
                        {category.parent?.name || "Root"}
                      </div>
                    </td>

                    {/* Managed By */}
                    <td className="px-6 py-4">
                      {category._count?.subcategories && category._count.subcategories > 0
                        ? "Yes"
                        : "No"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      {category.isActive ? (
                        <p className="w-18 text-left border border-gray-300 rounded-md tracking-tight">
                          <span
                            className="inline-flex items-center text-lg gap-1 rounded-full px-1.5 font-medium text-green-700"
                          >
                            ●
                          </span>
                          Active
                        </p>
                      )
                        : (
                          <p className="w-20 text-left border border-gray-300 rounded-md tracking-tight">
                            <span
                              className="inline-flex items-center text-lg gap-1 rounded-full px-1.5 font-medium text-red-700"
                            >
                              ●
                            </span>
                            Inactive
                          </p>
                        )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4 text-center">
                      <button className="text-gray-500 hover:text-black"
                        onClick={() => openModal(category)}
                      >
                        <SquarePen size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {open && (
        selectedCategory && (
          <EditCategory
            category={selectedCategory}
            categories={categories}
            closeModal={closeModal}
          />
        )
      )}
    </div>
  )
}


const FilterInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-100 w-[154px] border-0 border-b-2 hover:none rounded-none"
    />
  )
}

interface SelectFieldProps {
  value: string;
  options: OptionProps[];
  onChange: (value: string) => void;
}

interface OptionProps {
  label: string;
  value: string;
}

export function SelectField({
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#F8F8F8] w-[154px] border-0 border-b-2 text-gray-500 border-gray-200 rounded-none">
          <SelectValue placeholder={""} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
