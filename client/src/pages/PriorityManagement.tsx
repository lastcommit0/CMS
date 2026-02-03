import SearchBox from "@/components/SearchBox"
import { SquarePen, Loader2 } from "lucide-react"
import { usePriorities, useUpdatePriority } from "@/hooks/usePriorities"
import { useState } from "react"

export default function PriorityManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const { data: filteredPriorities, isLoading, isError } = usePriorities(debouncedSearch)
  const updatePriorityMut = useUpdatePriority()

  const handlePriorityChange = (storyId: string, sectionId: string, currentPriority: number, delta: number) => {
    const newPriority = Math.max(0, currentPriority + delta)
    updatePriorityMut.mutate({ storyId, sectionId, priority: newPriority })
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="text-black px-6 pt-2">
        <header className="flex justify-between items-center pb-2 min-w-full">
          <div className="text-[#243874] font-semibold text-[18px]">Priority Management</div>
          <div className="flex flex-row gap-4">
            <SearchBox
              placeholder="Search by Text or ID"
              value={searchTerm}
              onChange={(v) => setSearchTerm(v)}
              onSearch={(v) => setDebouncedSearch(v)}
            />
          </div>
        </header>
      </div>
      <div className="border-b"></div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden m-4">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#243874]" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 font-medium">
              Failed to load priorities. Please try again.
            </div>
          ) : (
            <table className="min-w-[1010px] w-full border-collapse">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Author</th>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Section Name</th>
                  <th className="px-4 py-3 text-center font-semibold">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {!filteredPriorities || filteredPriorities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      No priorities found.
                    </td>
                  </tr>
                ) : (
                  filteredPriorities.map((item) => (
                    <tr key={`${item.storyId}-${item.sectionId}`} className="text-sm text-gray-700 hover:bg-gray-50/50">
                      <td className="px-4 py-4 font-mono text-xs">{item.storyId.slice(0, 8)}...</td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[#243874] font-bold border border-gray-200">
                            {item.authorName?.[0] || 'A'}
                          </div>
                          <span className="font-medium">{item.authorName || 'Anonymous'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 max-w-md">
                        <div className="font-medium truncate text-gray-900">{item.storyTitle}</div>
                        <div className="text-[12px] text-gray-500 mt-1">
                          Updated On : <span className="text-gray-700 ml-1">
                            {new Date(item.updatedAt).toLocaleDateString(undefined, {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="bg-[#FCF0E4] text-[#865524] px-3 py-1 rounded-[4px] font-semibold text-xs border border-[#f5e1cf]">
                          {item.sectionName}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-gray-300 rounded-[4px] overflow-hidden bg-white">
                            <button
                              onClick={() => handlePriorityChange(item.storyId, item.sectionId, item.priority, -1)}
                              disabled={item.priority <= 0 || updatePriorityMut.isPending}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <span className="text-lg font-medium">−</span>
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center border-x border-gray-200 bg-gray-50/50 font-semibold text-[#243874]">
                              {item.priority}
                            </div>
                            <button
                              onClick={() => handlePriorityChange(item.storyId, item.sectionId, item.priority, 1)}
                              disabled={updatePriorityMut.isPending}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <span className="text-lg font-medium">+</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button className="text-gray-400 hover:text-[#243874] transition-colors p-1 rounded-full hover:bg-gray-100">
                          <SquarePen size={18} />
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
    </div>
  )
}