import { useState } from "react"
import PageHeader from "@/components/PageHeader"
import SearchBox from "@/components/SearchBox"
import NewVideo from "./components/NewVideo"
import { SquarePen, Loader2 } from "lucide-react"
import { useStories } from "@/hooks/useStories"

export const VideoList = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [open, setOpen] = useState(false);
    const { data: storiesData, isLoading, isError } = useStories({
        search: debouncedSearch,
        limit: 10,
        page: 1
    })

    const handleOpenModal = () => {
        setOpen(true);
    }

    const handleCloseModal = () => {
        setOpen(false);
    }

    return (
        <div className="w-full min-h-screen bg-[#F8F8F8]">
            {!open && (
                <>
                    <PageHeader
                        title="Video List"
                        right={
                            <div className="flex items-center gap-4">
                                <SearchBox
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    onSearch={setDebouncedSearch}
                                />
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="bg-[#243874] text-white h-9 px-4 rounded text-sm font-medium"
                                >
                                    + New Video
                                </button>
                            </div>
                        }
                    />

                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden m-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-[#243874]" />
                            </div>
                        ) : isError ? (
                            <div className="text-center py-20 text-red-500 font-medium">
                                Failed to load videos. Please try again.
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-[#FAFAFA] border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">ID</th>
                                        <th className="px-4 py-3 text-left font-semibold">Author</th>
                                        <th className="px-4 py-3 text-left font-semibold">Title</th>
                                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold">Paywall</th>
                                        <th className="px-4 py-3 text-center font-semibold">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {!storiesData?.data || storiesData.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                {debouncedSearch ? "No videos found matching your search." : "No Video Found"}
                                            </td>
                                        </tr>
                                    ) : (
                                        storiesData?.data.map((video) => (
                                            <tr key={video.id}>
                                                <td className="px-4 py-3">{video.id.slice(0, 8)}...</td>

                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#243874]">
                                                            {video.author?.name?.[0] || 'A'}
                                                        </div>
                                                        <span>{video.author?.name || 'Anonymous'}</span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900">
                                                        {video.articleTitle}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Published On : {video.createdAt ? new Date(video.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'} &nbsp; Updated On :
                                                        {video.updatedAt ? new Date(video.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-md border text-xs font-medium`}
                                                    >
                                                        <span
                                                            className={`w-2 h-2 rounded-full
                                                            ${video.status === "PUBLISHED"
                                                                    ? "bg-green-600"
                                                                    : "bg-red-600"
                                                                }`}
                                                        />
                                                        {video.status}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    {video.enablePaywall ? "Yes" : "No"}
                                                </td>

                                                <td className="px-4 py-3 text-center text-gray-500">
                                                    <SquarePen className="w-4 h-4 cursor-pointer" />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {open && (
                <NewVideo onClose={handleCloseModal} />
            )}
        </div>
    )
}
