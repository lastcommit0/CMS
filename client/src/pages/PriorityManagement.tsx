import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SquarePen } from "lucide-react"

const data = [
  {
    id: "1998498",
    author: "Kianna Kenter",
    avatar: "https://i.pravatar.cc/40?img=1",
    title: "Noida Bank Employee Booked For Illicitly Transferring Rs500 Crores...",
    published: "03-Jan-2023 | 08:53am",
    managedBy: "Kianna Kenter",
    status: "Published",
    priority: 1,
  },
  {
    id: "1998499",
    author: "Phillip Ekstrom",
    avatar: "https://i.pravatar.cc/40?img=2",
    title: "Dunki Release LIVE Updates: SRK Fans Call Film...",
    published: "06-Jan-2023 | 09:55am",
    managedBy: "Phillip Ekstrom",
    status: "Unpublished",
    priority: 0,
  },
]


export default function PriorityManagement() {


  return (
    <div className="w-full min-h-screen bg-white ml-36">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
        <header className="flex justify-between items-center pb-2 min-w-full">
          <div className="text-[#243874] font-semibold text-[18px]">Priority Management</div>
          <div className="flex flex-row gap-4">
            <div className="md:w-90 w-60 flex items-center overflow-hidden border-b border-gray-300 bg-[#EAEAEA] rounded-sm">
              <input
                type="text"
                placeholder="Search by Text or ID"
                className="flex-1 px-3 py-2 text-[14px] outline-none placeholder-[#606060]"
              />
              <button
                type="button"
                className="flex items-center justify-center px-3 text-gray-600 hover:text-gray-700"
              >
                <Search size={16} />
              </button>
            </div>
            <div className="relative w-45">
              <select
                className="w-full appearance-none border-b border-gray-300 bg-[#EAEAEA] rounded-sm px-2 py-2 pr-8 text-sm text-gray-600 outline-none"
              >
                <option value="home" className="text-gray-400">Home</option>
                <option value="active">Politics</option>
                <option value="inactive">Sports</option>
                <option value="inactive">Trending</option>
                <option value="inactive">Breaking</option>
                <option value="inactive">Regional</option>
              </select>

              {/* Custom dropdown icon */}
              <svg
                className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

          </div>
        </header>
      </div>
      <div className="border-b"></div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden m-4">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 text-center">Priority</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Managed By</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.map((item) => (
                <tr key={item.id} className="text-sm text-gray-700">
                  {/* Priority */}
                  <td className="px-4 py-4 text-center">
                    <div
                      className=" inline-flex items-center justify-center h-[31px] border border-gray-300 rounded-[4px] px-2 py-[2px] gap-4 text-sm  text-gray-700">
                      <button className="text-gray-500 hover:text-black leading-none">
                        −
                      </button>

                      <span className="min-w-[12px] text-center">
                        {item.priority}
                      </span>

                      <button className="text-gray-500 hover:text-black leading-none">
                        +
                      </button>
                    </div>
                  </td>


                  {/* ID */}
                  <td className="px-4 py-4">{item.id}</td>

                  {/* Author */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="h-8 w-8 rounded-full"
                      />
                      <span>{item.author}</span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-4 max-w-md">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="flex flex-row gap-1">
                      <div className="text-xs text-gray-500">
                        Published On : <span className="text-black">{item.published}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated On : <span className="text-black">{item.published}</span>
                      </div>
                    </div>
                  </td>

                  {/* Managed By */}
                  <td className="px-4 py-4">{item.managedBy}</td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    {item.status === "Published" ? (
                      <p className="w-24 text-left border border-gray-300 rounded-md tracking-tight">
                        <span
                          className="inline-flex items-center text-lg gap-1 rounded-full px-1.5 font-medium text-green-700"
                        >
                          ●
                        </span>
                        {item.status}
                      </p>
                    )
                    : (
                      <p className="w-28 text-left border border-gray-300 rounded-md tracking-tight">
                        <span
                          className="inline-flex items-center text-lg gap-1 rounded-full px-1.5 font-medium text-red-700"
                        >
                          ●
                        </span>
                        {item.status}
                      </p>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-center">
                    <button className="text-gray-500 hover:text-black">
                      <SquarePen size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}