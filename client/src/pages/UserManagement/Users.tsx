import SearchBox from "@/components/SearchBox"
import { useState } from "react"
import type { User } from "@/types/authTypes"

export default function Users() {

    const [searchQuery, setSearchQuery] = useState("")
    const [userData, setUserData] = useState<User[]>([])



    return (
        <div className="w-full min-h-screen bg-white">
            <header className="flex flex-row items-center justify-between px-6 py-4 border-b">
                <h1 className="text-[18px] font-semibold text-[#243874]">Users</h1>
                <div className="flex flex-row">
                    <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
            </header>
            <div>
                <table>
                    <thead>
                        tr
                    </thead>
                </table>
            </div>
        </div>
    )
}