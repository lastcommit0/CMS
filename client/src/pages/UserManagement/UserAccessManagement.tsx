import { Search, SquarePen, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const MOCK_DATA = [
  {
    id: 1,
    role: "Admin",
    pages: "All Pages",
  },
  {
    id: 2,
    role: "Sub Admin",
    pages:
      "Add Story, View Story, Add Breaking News, View Schedule Story, Add Priority, Contact List",
  },
  {
    id: 3,
    role: "Editor",
    pages:
      "Add Story, View Story, Add Breaking News, View Schedule Story",
  },
]

export default function UserAccessManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedPages, setSelectedPages] = useState<string[]>([
    "Add Breaking News",
    "View Schedule Story",
    "View Story",
  ])

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
        <h1 className="text-[18px] font-semibold text-[#243874]">
          User Access Management
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search by Text or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[360px] h-9 bg-[#EAEAEA] pr-9"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-[#243874] text-white h-9 px-4 rounded text-sm font-medium"
          >
            + New Access
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* Table */}
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8F8F8] border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Pages
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {MOCK_DATA.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm">{item.id}</td>
                  <td className="px-4 py-3 text-sm">{item.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.pages}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SquarePen className="w-4 h-4 inline cursor-pointer text-gray-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* BACKGROUND OVERLAY (this was broken earlier) */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* MODAL (centered & sharp) */}
          <div
            className="relative left-44 bg-white w-[510px] rounded-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold text-[#243874]">
                Add New Access
              </h2>
              <X
                className="w-4 h-4 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Modal body */}
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Select Role <span className="text-red-500">*</span>
                </label>
                <Select>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="subadmin">Sub Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Select Page Module <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPages.map((page) => (
                    <span
                      key={page}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded flex items-center gap-1"
                    >
                      {page}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() =>
                          setSelectedPages((prev) =>
                            prev.filter((p) => p !== page)
                          )
                        }
                      />
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full h-9 bg-[#243874] text-white rounded text-sm font-medium">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
