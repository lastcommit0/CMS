import { Search } from "lucide-react"



export default function UserAccessManagement(){

    return (
        <div>
            <header>
                <p>User Access Management</p>
                <div className="flex items-center overflow-hidden border-b border-gray-300 bg-gray-100">
                            <input
                                type="url"
                                placeholder=""
                                className="flex-1 px-3 py-2 text-sm outline-none"
                            />
                            <button
                                type="button"
                                className="flex items-center justify-center px-3 text-gray-500 hover:text-gray-700"
                            >
                                <Search size={16} />
                            </button>
                        </div>
            </header>
        </div>
    )
}