import { Search } from "lucide-react"
import { Pencil } from "lucide-react"

const data = [
  {
    id: "1998498",
    author: "Kianna Kenter",
    avatar: "https://i.pravatar.cc/40?img=1",
    title: "Noida Bank Employee Booked For Illicitly Transferring Rs500 Crores...",
    published: "03-Jan-2023 | 08:53am",
    updated: "03-Jan-2023 | 08:53am",
    approvedBy: "Kianna Kenter",
    status: "Published",
    priority: 1,
  },
  {
    id: "1998499",
    author: "Phillip Ekstrom",
    avatar: "https://i.pravatar.cc/40?img=2",
    title: "Dunki Release LIVE Updates: SRK Fans Call Film...",
    published: "06-Jan-2023 | 09:55am",
    updated: "06-Jan-2023 | 09:55am",
    approvedBy: "Phillip Ekstrom",
    status: "Unpublished",
    priority: 0,
  },
]


export default function ViewStory() {


  return (
    <div className="">
      <div className=" text-black px-6 pt-2">
        <header className="flex justify-between items-center pb-2 min-w-full">
          <div className="text-[#243874] font-semibold text-[18px]">View Story</div>
          <div className="flex flex-row gap-4">
            <div className="md:w-96 w-54 flex items-center overflow-hidden border-b border-gray-300 bg-[#EAEAEA] rounded-sm">
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
          </div>
        </header>
      </div>
      <div className="border-b"></div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden m-4">
        <div className="overflow-x-auto">
          <table className="min-w-[1010px] w-full border-collapse">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Approved By</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.map((item) => (
                <tr key={item.id} className="text-sm text-gray-700">
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
                      <div className="text-[12px] text-gray-500 flex flex-row items-center">
                        Published On :  <span className="text-black/80 text-[10px] ml-1">{item.published}</span>
                      </div>
                      <div className="text-[12px] text-gray-500">
                        Updated On : <span className="text-black/80 text-[10px] ml-1">{item.published}</span>
                      </div>
                    </div>
                  </td>

                  {/* Approved By */}
                  <td className="px-4 py-4">{item.approvedBy}</td>

                  {/* Status */}
                  <td className="px-4 py-4 text-start">
                    <span
                      className={`inline-flex items-center gap-1 bg-white border rounded-lg px-3 py-1 text-xs font-medium
                    ${item.status === "Published"
                          ? " text-green-700"
                          : " text-red-700"
                        }`}
                    >
                      ● {item.status}
                    </span>
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