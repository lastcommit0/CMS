import { Search, Loader2 } from "lucide-react"
import { useStories } from "@/hooks/useStories"
import { useState } from "react"
import { format } from "date-fns"

export default function ViewStory() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: stories, isLoading, isError } = useStories({
    search: searchTerm,
    limit: 10,
    page: 1
  })

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#243874]" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 font-medium">
              Failed to load stories. Please try again.
            </div>
          ) : (
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
                {stories?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No stories found.
                    </td>
                  </tr>
                ) : (
                  stories?.data.map((item: any) => (
                    <tr key={item.id} className="text-sm text-gray-700">
                      <td className="px-4 py-4">{item.id.slice(0, 8)}...</td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-[#243874] font-bold">
                            {(item.author?.name || 'A')[0]}
                          </div>
                          <span>{item.author?.name || 'Anonymous'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 max-w-md">
                        <div className="font-medium truncate">{item.articleTitle}</div>
                        <div className="flex flex-row gap-1">
                          <div className="text-[12px] text-gray-500 flex flex-row items-center">
                            Published On : <span className="text-black/80 text-[10px] ml-1">
                              {item.createdAt ? format(new Date(item.createdAt), "dd-MMM-yyyy | hh:mm a") : 'N/A'}
                            </span>
                          </div>
                          <div className="text-[12px] text-gray-500">
                            Updated On : <span className="text-black/80 text-[10px] ml-1">
                              {item.updatedAt ? format(new Date(item.updatedAt), "dd-MMM-yyyy | hh:mm a") : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">{item.mandal || 'N/A'}</td>

                      <td className="px-4 py-4 text-start">
                        <span
                          className={`inline-flex items-center gap-1 bg-white border rounded-lg px-3 py-1 text-xs font-medium
                        ${item.status === "PUBLISHED"
                              ? " text-green-700 border-green-200"
                              : item.status === "DRAFT"
                                ? " text-gray-600 border-gray-200"
                                : " text-red-700 border-red-200"
                            }`}
                        >
                          ● {item.status}
                        </span>
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