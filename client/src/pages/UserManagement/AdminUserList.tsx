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
import type{ UserFormState } from "@/types/userTypes"
import { UserRole, Designation, JobType, UserStatus } from "@/types/userTypes"

const MOCK_DATA = [
  {
    id: 1,
    user: "Saket Pandey",
    email: "saket.pandey@test.com",
    role: "Admin",
    bio: "Manages all pages and user permissions",
    pages: "All Pages",
  },
  {
    id: 2,
    user: "Hannah Green",
    email: "hannah.green@test.com",
    role: "Sub Admin",
    bio: "Responsible for adding and reviewing stories",
    pages:
      "Add Story, View Story, Add Breaking News, View Schedule Story, Add Priority, Contact List",
  },
  {
    id: 3,
    user: "John Doe",
    email: "john.doe@test.com",
    role: "Editor",
    bio: "Handles editing and priority stories",
    pages:
      "Add Story, View Story, Add Breaking News, View Schedule Story",
  },
]


export const initialUserFormState: UserFormState = {
  basicInfo: {
    firstName: "",
    lastName: "",
    email: "",
    whatsAppNo: "",
    password: "",
    location: "",
    profileSummary: "",
    avatar: undefined,
  },
  professionalInfo: {
    role: UserRole.EDITOR,
    designation: Designation.WRITER,
    jobType: JobType.FULL_TIME,
    status: UserStatus.ACTIVE,
    managerId: undefined,
  },
}

export default function UserAccessManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedPages, setSelectedPages] = useState<string[]>([
    "Add Breaking News",
    "View Schedule Story",
    "View Story",
  ])
  const [editingUser, setEditingUser] = useState<any>(null)
  const [bioInput, setBioInput] = useState("")

  const openModal = (user?: any) => {
    setEditingUser(user || null)
    setBioInput(user?.bio || "")
    setOpen(true)
  }

  const handleSubmit = () => {
    // Here you would call your API to save the bio + pages
    console.log("Saving:", { bio: bioInput, pages: selectedPages, user: editingUser })
    setOpen(false)
  }

  const filteredData = MOCK_DATA.filter(
    (item) =>
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
        <h1 className="text-[18px] font-semibold text-[#243874]">
          Admin User List
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
            onClick={() => openModal()}
            className="bg-[#243874] text-white h-9 px-4 rounded text-sm font-medium"
          >
            + New User
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
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Bio</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-sm">{user.id}</td>
                  <td className="px-4 py-3 text-sm">{user.user}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.role}</td>
                  <td className="px-4 py-3 text-sm">{user.bio}</td>
                  <td className="px-4 py-3 text-center">
                    <SquarePen
                      className="w-4 h-4 cursor-pointer text-blue-600 mx-auto"
                      onClick={() => openModal(user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed min-h-screen inset-0 z-50 flex justify-end items-start">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative min-h-screen w-[520px] max-h-[90vh] overflow-y-auto
                 bg-white shadow-xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold text-[#243874]">
                Add New User
              </h2>
              <X
                className="w-4 h-4 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">

              {/* Profile photo */}
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <button className="border w-[150px] px-3 py-1 rounded text-sm">
                    Upload New Photo
                  </button>
                  <p className="text-[14px] pt-4">At least 150x150 px recommended JPG, PNG or JPEG is allowed</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold">Basic Info</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[14px] text-[#525252] font-medium">First Name<span className="text-red-500">*</span></label>
                  <input className="w-full bg-gray-100 border-b border-gray-300 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] text-[#525252] font-medium">Last Name <span className="text-red-500">*</span></label>
                  <input className="w-full bg-gray-100 border-b border-gray-300 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] text-[#525252] font-medium">WhatsApp No. <span className="text-red-500">*</span></label>
                  <input className="w-full bg-gray-100 border-b border-gray-300 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block mb-1 text-[14px] text-[#525252] font-medium">Password <span className="text-red-500">*</span></label>
                  <input className="w-full bg-gray-100 border-b border-gray-300 p-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-[14px] text-[#525252] font-medium">Location</label>
                <input className="w-full bg-gray-100 border-b border-gray-300 p-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block mb-1 text-[14px] text-[#525252] font-medium">Email Address <span className="text-red-500">*</span></label>
                <input className="w-full bg-gray-100 border-b border-gray-300 p-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block mb-1 text-[14px] text-[#525252] font-medium">Profile Summary <span className="text-red-500">*</span></label>
                <input className="w-full bg-gray-100 border-b border-gray-300 p-2 text-sm outline-none" />
              </div>

              {/* Professional Info */}
              <h3 className="text-sm font-semibold">Professional Info</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#606060] font-semibold mb-2">Job Type<span className="text-red-500">*</span></label>
                  <Select>
                    <SelectTrigger className="w-[231px] bg-[#F8F8F8] border-0 border-b-2 border-gray-200 rounded-none">
                      <SelectValue placeholder="Story" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-[#606060] font-semibold mb-2">Designation<span className="text-red-500">*</span></label>
                  <Select>
                    <SelectTrigger className="w-[231px] bg-[#F8F8F8] border-0 border-b-2 border-gray-200 rounded-none">
                      <SelectValue placeholder="Story" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-[#606060] font-semibold mb-2">Reporting Manager<span className="text-red-500">*</span></label>
                  <Select>
                    <SelectTrigger className="w-[231px] bg-[#F8F8F8] border-0 border-b-2 border-gray-200 rounded-none">
                      <SelectValue placeholder="Story" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-[#606060] font-semibold mb-2">Select Role<span className="text-red-500">*</span></label>
                  <Select>
                    <SelectTrigger className="w-[231px] bg-[#F8F8F8] border-0 border-b-2 border-gray-200 rounded-none">
                      <SelectValue placeholder="Story" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit */}
              <button className="w-full h-10 bg-[#243874] text-white rounded text-sm font-medium">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}


