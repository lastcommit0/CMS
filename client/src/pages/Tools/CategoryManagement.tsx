import { Search } from "lucide-react"
import { Pencil } from "lucide-react"

const data = [
  {
    id: "1998498",
    author: "Kianna Kenter",
    avatar: "https://i.pravatar.cc/40?img=1",
    title: "Noida Bank Employee Booked For Illicitly Transferring Rs500 Crores...",
    published: "03-Jan-2023 | 08:53am",
    managedBy: "Kianna Kenter",
    status: "Active",
    priority: 1,
  },
  {
    id: "1998499",
    author: "Phillip Ekstrom",
    avatar: "https://i.pravatar.cc/40?img=2",
    title: "Dunki Release LIVE Updates: SRK Fans Call Film...",
    published: "06-Jan-2023 | 09:55am",
    managedBy: "Phillip Ekstrom",
    status: "InActive",
    priority: 0,
  },
]


export default function CategoryManagement() {


    return (
        <div className="ml-94">
            <div className=" text-black px-6 pt-2">
                <header className="flex justify-between items-center pb-2 min-w-full">
                    <div className="text-[#243874] font-semibold text-[18px]">Categoty Management</div>
                </header>
            </div>
            <div className="border-b"></div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden m-4">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-center">Category Name (Eng)</th>
              <th className="px-4 py-3 text-center">Category Name (Hindi)</th>
              <th className="px-4 py-3 text-left">Folder</th>
              <th className="px-4 py-3 text-left">Is Parent</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className="text-sm text-gray-700">
                {/* Priority */}
                <td className="px-4 py-4 text-center">
                  <div className="inline-flex items-center gap-2 border rounded-md px-2 py-1">
                    <button className="text-gray-500 hover:text-black">-</button>
                    <span>{item.priority}</span>
                    <button className="text-gray-500 hover:text-black">+</button>
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
                  <div className="text-xs text-gray-500">
                    Published On : {item.published}
                  </div>
                </td>

                {/* Managed By */}
                <td className="px-4 py-4">{item.managedBy}</td>

                {/* Status */}
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
                    ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    ● {item.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-4 text-center">
                  <button className="text-gray-500 hover:text-black">
                    <Pencil size={16} />
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