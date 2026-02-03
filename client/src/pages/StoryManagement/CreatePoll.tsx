import Poll from "./components/Poll"
import { useState } from "react"
import SearchBox from "@/components/SearchBox"
import { Button } from "@/components/ui/button"
import { SquarePen, Loader2 } from "lucide-react"
import { limitWords } from "@/utils/text"
import { usePolls } from "@/hooks/usePolls"

export default function CreatePoll() {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { data: pollsData, isLoading, isError } = usePolls({
        search: searchTerm,
        limit: 10,
        page: 1
    })

    const onClose = () => {
        setOpen(false)
    }

    const onOpen = () => {
        setOpen(true)
    }

    return (
        <div>
            <header className="flex flex-row justify-between items-center pb-4 min-w-full px-6 py-4 border-b bg-white">
                <div className="text-[18px] text-[#243874] font-semibold">
                    Create Poll
                </div>
                <div className="flex flex-row gap-4">
                    <SearchBox
                        value={searchTerm}
                        onChange={(v) => setSearchTerm(v)}
                        placeholder="Search by Text or ID"
                    />
                    <Button
                        onClick={() => onOpen()}
                        className="bg-[#243874] text-white h-9 px-4 hover:bg-[#243874]/90 rounded-[4px]"
                    >
                        + New Poll
                    </Button>
                </div>
            </header>
            <div className="bg-white rounded-lg overflow-hidden m-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#243874]" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 text-red-500 font-medium">
                        Failed to load polls. Please try again.
                    </div>
                ) : (
                    <table className="min-w-[1010px] w-full border-collapse">
                        <thead className="bg-gray-50 text-sm text-gray-600">
                            <tr className="">
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left">Updated Date</th>
                                <th className="px-4 py-3 text-left">Expires Date</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pollsData?.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        No polls found.
                                    </td>
                                </tr>
                            ) : (
                                pollsData?.data.map((poll) => (
                                    <tr key={poll.id} className="text-sm text-gray-700">
                                        <td className="px-4 py-4">{poll.id.slice(0, 8)}...</td>

                                        <td className="px-4 py-4 max-w-md">
                                            <div className="font-medium truncate">{limitWords(poll.title, 5)}</div>
                                        </td>

                                        <td className="px-4 py-4">
                                            {new Date(poll.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>

                                        <td className="px-4 py-4">
                                            {new Date(poll.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${poll.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {poll.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 ">
                                            <button className="text-gray-500 hover:text-black">
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
            {open && (
                <Poll onClose={onClose} />
            )}
        </div>
    )
}