import { Calendar, Search } from "lucide-react"

const reports = [
  {
    id: 1,
    title:
      "Ayodhya Ram Mandir Inauguration Live Updates: PM Modi unveils Jatayu statue...",
    updatedAt: "12-Jan-2024 | 08:53 am",
  },
  {
    id: 2,
    title: "Dunki Release LIVE Updates: SRK Fans Call...",
    updatedAt: "13-Jan-2024 | 09:33 am",
  },
  {
    id: 3,
    title:
      "RIL Chairman Mukesh Ambani makes donation of ₹2.51 crore to Ram Janmabhoomi Teerth Kshetra trust",
    updatedAt: "14-Jan-2024 | 08:30 am",
  },
]

export default function DownloadReport() {
  return (
    <div className="ml-90 px-6 py-4 bg-[#F5F6FA] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#243874] font-semibold text-lg">
          Download Report
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Select Author */}
          <select className="border px-3 py-2 text-sm rounded w-56 bg-[#F5F6FA] outline-none">
            <option>Select Author</option>
            <option>Admin</option>
            <option>Editor</option>
          </select>

          {/* Start Date */}
          <div className="relative">
            <input
              type="text"
              placeholder="Start Date"
              className="border px-3 py-2 pr-10 text-sm rounded bg-[#F5F6FA] outline-none"
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <input
              type="text"
              placeholder="End Date"
              className="border px-3 py-2 pr-10 text-sm rounded bg-[#F5F6FA] outline-none"
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* Search */}
          <button className="bg-[#243874] text-white px-5 py-2 text-sm rounded">
            Search
          </button>

            <button className="bg-[#243874] text-white text-sm px-4 py-2 rounded">
            Download
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3 text-left w-20">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-right w-60">Updated Date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {reports.map((item) => (
              <tr key={item.id} className="text-sm text-gray-700">
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3 truncate max-w-[700px]">
                  {item.title}
                </td>
                <td className="px-4 py-3 text-right">
                  {item.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
