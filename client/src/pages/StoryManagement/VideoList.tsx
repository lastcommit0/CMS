import { useState } from "react"
import PageHeader from "@/components/PageHeader"
import SearchBox from "@/components/SearchBox"
import NewVideo from "./components/NewVideo"
import { SquarePen } from "lucide-react"

interface Access {
    id: number
    author: string
    avatar: string
    title: string
    publishedAt: string
    updatedAt: string
    status: "PUBLISHED" | "UNPUBLISHED"
    paywall: boolean
}

type VideoView = "LIST" | "CREATE"


export const VideoList = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [view, setView] = useState<VideoView>("LIST")
    const [open, setOpen] = useState(false);
    const [accessList] = useState<Access[]>([
        {
            id: 1998498,
            author: "Kianna Kenter",
            avatar: "https://i.pravatar.cc/40?img=1",
            title: "Noida Bank Employee Booked For Illicitly Transferring...",
            publishedAt: "03-Jan-2023 | 08:53am",
            updatedAt: "03-Jan-2023 | 08:53am",
            status: "PUBLISHED",
            paywall: true,
        },
        {
            id: 1998499,
            author: "Philip Ekstrom",
            avatar: "https://i.pravatar.cc/40?img=2",
            title: "Dunki Release LIVE Updates: SRK Fans Call Film...",
            publishedAt: "06-Jan-2023 | 09:55am",
            updatedAt: "06-Jan-2023 | 10:25am",
            status: "UNPUBLISHED",
            paywall: false,
        },
    ])

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
                                    value={searchQuery}
                                    onChange={setSearchQuery}
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

                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden p-6">
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
                                {accessList.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No Video Found
                                        </td>
                                    </tr>
                                ) : (
                                    accessList.map((video) => (
                                        <tr key={video.id}>
                                            <td className="px-4 py-3">{video.id}</td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={video.avatar}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <span>{video.author}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">
                                                    {video.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Published On : {video.publishedAt} &nbsp; Updated On :
                                                    {video.updatedAt}
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
                                                    {video.status === "PUBLISHED"
                                                        ? "Published"
                                                        : "Unpublished"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                {video.paywall ? "Yes" : "No"}
                                            </td>

                                            <td className="px-4 py-3 text-center text-gray-500">
                                                <SquarePen className="w-4 h-4 cursor-pointer" />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {open && (
                // <>
                //     <PageHeader
                //         title="New Video"
                //         right={
                //             <div className="flex items-center gap-2">
                //                 <button
                //                     onClick={() => setView("LIST")}
                //                     className="bg-gray-200 text-gray-700 h-9 px-4 rounded text-sm font-medium"
                //                 >
                //                     Cancel
                //                 </button>
                //                 <button className="bg-[#243874] text-white h-9 px-4 rounded text-sm font-medium">
                //                     Submit
                //                 </button>
                //             </div>
                //         }
                //     />

                // </>
                    <NewVideo onClose={handleCloseModal}/>
            )}
        </div>
    )

}
