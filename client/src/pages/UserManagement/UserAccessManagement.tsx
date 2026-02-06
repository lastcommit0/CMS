import { SquarePen, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import SearchBox from "@/components/SearchBox"
import { Button } from "@/components/ui/button"

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
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-[18px] font-semibold text-[#243874]">
          User Access Management
        </h1>

        <div className="flex items-center gap-4">
          <SearchBox value={searchQuery} onChange={setSearchQuery} />

          <Button
            onClick={() => setOpen(true)}
            className="bg-[#243874] text-white h-9 px-4 hover:bg-[#243874]/90"
          >
            + New Access
          </Button>
        </div>
      </header>


      {/* Table */}
      <div className="p-4 md:p-6">
        <div className="bg-white border rounded-md overflow-hidden">
          <table className="min-w-[700px] w-full">
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
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[380px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* BACKGROUND OVERLAY (this was broken earlier) */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* MODAL (centered & sharp) */}
          <div
            className="relative bg-white w-full max-w-[510px] rounded-md shadow-xl"
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
