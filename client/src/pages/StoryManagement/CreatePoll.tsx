import Poll from "./components/Poll"
import { useState } from "react"
import SearchBox from "@/components/SearchBox"
import { Button } from "@/components/ui/button"
import { SquarePen } from "lucide-react"
import { limitWords } from "@/utils/text"


export default function CreatePoll() {
    const [open, setOpen] = useState(false)

    const onClose = () => {
        setOpen(false)
    }

    const onOpen = () => {
        setOpen(true)
    }

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
            <header className="flex flex-row justify-between items-center pb-4 min-w-full px-6 py-4 border-b bg-white">
                <div className="text-[18px] text-[#243874] font-semibold">
                    Create Poll
                </div>
                <div className="flex flex-row gap-4">
                    <SearchBox value="" onChange={(v) => { }} placeholder="Search by Text or ID" />
                    <Button
                        onClick={() => onOpen()}
                        className="bg-[#243874] text-white h-9 px-4 hover:bg-[#243874]/90 rounded-[4px]"
                    >
                        + New Poll
                    </Button>
                </div>
            </header>
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
                        {data.map((story) => (
                            <tr key={story.id} className="text-sm text-gray-700">
                                <td className="px-4 py-4">{story.id}</td>

                                <td className="px-4 py-4 max-w-md">
                                    <div className="font-medium truncate">{limitWords(story.title, 5)}</div>
                                </td>

                                <td className="px-4 py-4">{story.updated}</td>

                                <td className="px-4 py-4">{story.scheduleDate}</td>

                                <td className="px-4 py-4">{story.scheduleBy}</td>

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
            {open && (
                <Poll onClose={onClose} />
            )}
        </div>
    )
}