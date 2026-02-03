import { SquarePen, Loader2 } from "lucide-react"
import { useState } from "react"
import { useStories } from "@/hooks/useStories"
import SearchBox from "@/components/SearchBox"


export default function ScheduledStory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const { data: stories, isLoading, isError } = useStories({
    status: 'SCHEDULED',
    search: debouncedSearch
  })

  return (
    <div>
      <header className="flex flex-row justify-between items-center pb-2 min-w-full px-8 py-4">
        <div className="text-[18px] text-[#243874] font-semibold">
          View Schedule Story
        </div>
        <div>
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setDebouncedSearch}
            placeholder="Search by Text or ID"
          />
        </div>
      </header>
      <div className="border-b"></div>
      <div className="bg-white rounded-lg overflow-hidden m-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#243874]" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">Failed to load scheduled stories.</div>
        ) : (
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
              {!stories?.data || stories.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">No scheduled stories found.</td>
                </tr>
              ) : (
                stories.data.map((story) => (
                  <tr key={story.id} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="px-4 py-4">{story.id.slice(0, 8)}...</td>
                    <td className="px-4 py-4 max-w-md">
                      <div className="font-medium truncate">{story.shortTitle || story.articleTitle}</div>
                    </td>
                    <td className="px-4 py-4">{new Date(story.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">{story.scheduleAt ? new Date(story.scheduleAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-4">{story.author?.name || 'Unknown'}</td>
                    <td className="px-4 py-4 ">
                      <button className="text-gray-500 hover:text-[#243874]">
                        <SquarePen size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}