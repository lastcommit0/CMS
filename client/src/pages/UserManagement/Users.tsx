import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { User } from "@/types/authTypes"

export default function Users() {

    const [searchQuery, setSearchQuery] = useState("")
    const [userData, setUserData] = useState<User[]>([])



    return (
        <div className="w-full min-h-screen bg-[#F8F8F8]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
                <h1 className="text-[18px] font-semibold text-[#243874]">
                    Users
                </h1>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Input
                            placeholder="Search by Text or ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[360px] h-9 bg-[#EAEAEA] pr-9"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                </div>
            </div>

        </div>
    )
}