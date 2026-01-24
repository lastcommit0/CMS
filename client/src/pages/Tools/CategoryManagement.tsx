import { Input } from "@/components/ui/input";
import { SquarePen, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import EditCategory from "./components/EditCategory";

const data = [
  {
    id: "1",
    categoryEng: "UP News",
    categoryHindi: "UP News",
    Folder: "UP News",
    IsParent: "Agra",
    status: "Active",
    action: "",
  },
  {
    id: "2",
    categoryEng: "UP News",
    categoryHindi: "UP News",
    Folder: "UP News",
    IsParent: "Agra",
    status: "InActive",
    action: "",
  },
  {
    id: "3",
    categoryEng: "UP News",
    categoryHindi: "UP News",
    Folder: "UP News",
    IsParent: "dubai",
    status: "Active",
    action: "",
  },
  {
    id: "4",
    categoryEng: "UP News",
    categoryHindi: "UP News",
    Folder: "UP News",
    IsParent: "Agra",
    status: "InActive",
    action: "",
  }
]


export default function CategoryManagement() {
  const [open, setOpen] =  useState(false);
  const [selectedCategory, setSelectedCategory] = useState(data[0]);

  const openModal = (category: any)=> {
    setSelectedCategory(category);
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  }


  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
        <header className="flex justify-between items-center pb-2 min-w-full">
          <div className="text-[#243874] font-semibold text-[18px]">Categoty Management</div>
        </header>
      </div>
      <div className="border-b"></div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden m-4">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse">
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
                  <FilterInput></FilterInput>
                </th>
                <th className="px-4 py-3 text-center">
                  <FilterInput></FilterInput>
                </th>
                <th className="px-4 py-3 text-center">
                  <FilterInput></FilterInput>
                </th>
                <th className="px-4 py-3 text-center">
                  <SelectField value={""} options={[]} onChange={()=>{}} />
                </th>
                <th className="px-4 py-3 text-center">
                  <SelectField value={""} options={[]} onChange={()=>{}} />
                </th>
                <th className="px-4 py-3 text-center text-green-400"><Check></Check></th>
                
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.map((category) => (
                <tr key={category.id} className="text-sm text-gray-700">
                  {/* Priority */}

                  {/* ID */}
                  <td className="px-4 py-4">{category.id}</td>

                  {/* Author */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{category.categoryEng}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{category.categoryHindi}</span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex items-center gap-2">
                      {category.Folder}
                    </div>
                  </td>

                  {/* Managed By */}
                  <td className="px-6 py-4">{category.IsParent}</td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    {category.status === "Active" ? (
                      <p className="w-18 text-left border border-gray-300 rounded-md tracking-tight">
                        <span
                          className="inline-flex items-center text-lg gap-1 rounded-full px-1.5 font-medium text-green-700"
                        >
                          ●
                        </span>
                        {category.status}
                      </p>
                    )
                    : (
                      <p className="w-20 text-left border border-gray-300 rounded-md tracking-tight">
                        <span
                          className="inline-flex items-center text-lg gap-1 rounded-full px-1.5 font-medium text-red-700"
                        >
                          ●
                        </span>
                        {category.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {open && (
        <EditCategory category={selectedCategory} closeModal={closeModal}  />
      )}
    </div>
  )
}


const FilterInput = ({}) => {
  return (
    <Input
      value={""}
      onChange={() => {}}
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
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}