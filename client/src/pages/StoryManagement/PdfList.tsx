import { useState } from "react"
import PageHeader from "@/components/PageHeader"
import SearchBox from "@/components/SearchBox"
import { MoreVertical, SquarePen, Trash2, Loader2, FileText } from "lucide-react"
import NewPaper from "./components/NewPaper"
import { useEpapers } from "@/hooks/useEpapers"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const EditButton = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical size={16} className="text-gray-500" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <SquarePen size={14} />
                    <span>Edit Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
                    <Trash2 size={14} />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const PdfList = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [open, setOpen] = useState(false);

    const { data: epapersData, isLoading, isError } = useEpapers({
        search: debouncedSearch,
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
                        title="E-Paper List"
                        right={
                            <div className="flex items-center gap-4">
                                <SearchBox
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    onSearch={setDebouncedSearch}
                                />
                                <button
                                    onClick={handleOpenModal}
                                    className="bg-[#243874] text-white h-9 px-4 rounded text-sm font-medium hover:bg-[#243874]/90 transition-colors"
                                >
                                    + New Paper
                                </button>
                            </div>
                        }
                    />

                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden m-6 shadow-sm">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-[#243874]" />
                            </div>
                        ) : isError ? (
                            <div className="text-center py-20 text-red-500 font-medium">
                                Failed to load E-Papers. Please try again.
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-[#FAFAFA] border-b text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">Preview</th>
                                        <th className="px-4 py-3 text-left font-semibold">Title</th>
                                        <th className="px-4 py-3 text-left font-semibold">Type</th>
                                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                                        <th className="px-4 py-3 text-center font-semibold">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y text-gray-700">
                                    {!epapersData?.data || epapersData.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-10 text-center text-gray-500"
                                            >
                                                {debouncedSearch ? "No E-Papers found matching your search." : "No E-Papers found."}
                                            </td>
                                        </tr>
                                    ) : (
                                        epapersData.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    {item.coverImageUrl ? (
                                                        <img src={item.coverImageUrl} className="h-12 w-9 object-cover rounded shadow-sm border border-gray-200" alt="Cover" />
                                                    ) : (
                                                        <div className="h-12 w-9 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                                                            <FileText size={16} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 font-medium">
                                                    {item.title}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.type === 'EPAPER' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {item.type}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-gray-500">
                                                    {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full ${item.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    <EditButton />
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
                <NewPaper onClose={handleCloseModal} />
            )}
        </div>
    )
}
