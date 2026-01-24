import SearchBox from "@/components/SearchBox"
import { Button } from "@/components/ui/button"


export const ContactList = () => {

    return (
        <div className="bg-white">
            <header className="flex flex-row border-b items-center justify-between pb-4 min-w-full px-6 py-4 bg-white">
                <h1 className="text-[18px] text-[#243874] font-semibold">
                    Contact List
                </h1>
                <div className="flex flex-row gap-4">
                    <SearchBox value="" onChange={(v) => { }} placeholder="Search by Text or ID" />
                    <Button className="bg-[#243874]">
                        Download List
                    </Button>
                </div>
            </header>
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden p-6">
                <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA] border-b">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}