import SearchBox from "@/components/SearchBox"
import { SquarePen } from "lucide-react"
import { limitWords } from "@/utils/text"


export default function ScheduledStory(){
  const data = [
    {
      id: "1998498",
      title: "Noida Bank Employee Booked For Illicitly Transferring Rs500 Crores...",
      published: "03-Jan-2023 | 08:53am",
      updated: "03-Jan-2023 | 08:53am",
      scheduleDate: "03-Jan-2023 | 08:53am",
      scheduleBy: "Kianna Kenter",
    },
    {
      id: "1998499",
      title: "Dunki Release LIVE Updates: SRK Fans Call Film...",
      published: "06-Jan-2023 | 09:55am",
      updated: "06-Jan-2023 | 09:55am",
      scheduleDate: "06-Jan-2023 | 09:55am",
      scheduleBy: "Phillip Ekstrom",
    },
  ]

  return (
    <div>
      <header className="flex flex-row justify-between items-center pb-2 min-w-full px-8 py-4">
        <div className="text-[18px] text-[#243874] font-semibold">
          View Schedule Story
        </div>
        <div>
          <SearchBox value="" onChange={(v)=>{}} placeholder="Search by Text or ID" />
        </div>
      </header>
      <div className="border-b"></div>
      <div className="bg-white rounded-lg overflow-hidden m-4">
        <table className="min-w-[1010px] w-full border-collapse">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr className="">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Updated Date</th>
              <th className="px-4 py-3 text-left">Schedule Date</th>
              <th className="px-4 py-3 text-left">Schedule By</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((story)=>(
              <tr key={story.id} className="text-sm text-gray-700">
                {/* ID */}
                <td className="px-4 py-4">{story.id}</td>

                {/* Title */}
                <td className="px-4 py-4 max-w-md">
                  <div className="font-medium truncate">{limitWords(story.title, 5)}</div>
                </td>

                {/* Updated Date */}
                <td className="px-4 py-4">{story.updated}</td>

                {/* Schedule Date */}
                <td className="px-4 py-4">{story.scheduleDate}</td>

                {/* Schedule By */}
                <td className="px-4 py-4">{story.scheduleBy}</td>

                {/* Action */}
                <td className="px-4 py-4 ">
                  <button className="text-gray-500 hover:text-black">
                    <SquarePen size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}