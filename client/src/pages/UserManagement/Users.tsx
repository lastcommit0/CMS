import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type{User} from "@/types/authTypes"

export default function Users() {

    const [searchQuery, setSearchQuery] = useState("")
    const [userData, setUserData] = useState<User[]>([])



    return (
        <div className="ml-90 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-3 px-6">
                {/* Left title */}
                <h1 className="text-[18px] font-semibold text-[#243874]">
                    Users
                </h1>

                {/* Right controls */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search by Text or ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[360px] h-9 bg-[#EAEAEA] rounded-[4px] pl-3 pr-9"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="border-b-2 border-gray-300"></div>
            
            <div className="w-full max-w-[1300px] rounded-md border border-gray-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#F8F8F8] border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1E1E1E] w-[110px]">
                                    ID
                                </th>
                                <th>
                                    User
                                </th>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Contact No.
                                </th>
                                <th>
                                    Social
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}