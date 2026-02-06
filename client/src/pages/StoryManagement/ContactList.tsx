import { useState } from "react"
import SearchBox from "@/components/SearchBox"
import { Button } from "@/components/ui/button"
import { useContacts, useDeleteContact } from "@/hooks/useContacts"
import { Loader2, Trash2 } from "lucide-react"

export const ContactList = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const { data: contactData, isLoading, isError } = useContacts({
        search: debouncedSearch,
    })
    const deleteMut = useDeleteContact();

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            deleteMut.mutate(id);
        }
    }

    const handleDownload = () => {
        // Simple CSV download logic
        if (!contactData?.data) return;

        const headers = ["ID", "Name", "Email", "Phone", "Message", "Date"];
        const rows = contactData.data.map(m => [
            m.id,
            m.name,
            m.email,
            m.phone || "",
            m.message.replace(/"/g, '""'),
            new Date(m.createdAt).toISOString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        link.setAttribute("download", `contacts_${dateStr}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="bg-white min-h-screen">
            <header className="flex flex-row border-b items-center justify-between pb-4 min-w-full px-6 py-4 bg-white sticky top-0 z-10">
                <h1 className="text-[18px] text-[#243874] font-semibold">
                    Contact List
                </h1>
                <div className="flex flex-row gap-4">
                    <SearchBox
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={setDebouncedSearch}
                        placeholder="Search by name, email or message"
                    />
                    <Button
                        className="bg-[#243874] hover:bg-[#243874]/90"
                        onClick={handleDownload}
                        disabled={!contactData?.data?.length}
                    >
                        Download List
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-md border border-gray-200 overflow-hidden m-6 shadow-sm">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#243874]" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 text-red-500 font-medium">
                        Failed to load contact messages. Please try again.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-[#FAFAFA] border-b text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Date</th>
                                <th className="px-4 py-3 text-left font-semibold">Name</th>
                                <th className="px-4 py-3 text-left font-semibold">Email</th>
                                <th className="px-4 py-3 text-left font-semibold">Phone Number</th>
                                <th className="px-4 py-3 text-left font-semibold">Message</th>
                                <th className="px-4 py-3 text-center font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-gray-700">
                            {!contactData?.data || contactData.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                                        {debouncedSearch ? "No messages found matching your search." : "No messages found."}
                                    </td>
                                </tr>
                            ) : (
                                contactData.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3 text-blue-600">{item.email}</td>
                                        <td className="px-4 py-3">{item.phone || '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-md truncate" title={item.message}>
                                                {item.message}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={16} />
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