import logo from "../assets/icons/logo.svg"
import layout from "../assets/icons/layout.svg"
import users from "../assets/icons/users.svg"
import text from "../assets/icons/text.svg"
import tool from "../assets/icons/tool.svg"
import huge from "../assets/icons/huge.svg"
import { useState } from "react"


const menuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: layout,
        subItems: []
    },
    {
        id: "story",
        label: "Story Management",
        icon: text,
        subItems: ["Add Story", "View Story", "View Schedule Story", "E-Paper PDF List", "Create Poll", "Video List", "Contact List"]
    },
    {
        id: "priority",
        label: "Priority Management",
        icon: huge,
        subItems: []
    },
    {
        id: "tools",
        label: "Tools",
        icon: tool,
        subItems: ["Category Management", "Meta Management", "Download Report"]
    },
    {
        id: "users",
        label: "User Management",
        icon: users,
        subItems: ["User Access Management", "Admin User List", "Users"]
    }
];


export default function Sidebar() {

    const [activeMenu, setActiveMenu] = useState("dashboard");

    // Helper to get the sub-items of the currently active menu
    const activeSubItems = menuItems.find(item => item.id === activeMenu)?.subItems || [];

    return (
        <aside className="w-36 h-screen bg-[#1c1c1f] text-white flex flex-col items-center py-6">
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-row items-center gap-1">
                    <img 
                        src={logo} 
                        alt="Uttar Pradesh Times Logo" 
                        className="w-11 h-auto object-contain" 
                    />

                    <h3 className="flex flex-col items-start justify-center text-white font-semibold uppercase tracking-wide leading-none text-xs">
                        <span>Uttar</span>
                        <span>Pradesh</span>
                        <span>Times</span>
                    </h3>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`flex flex-col items-center justify-center gap-1 rounded-md w-full py-3 px-4 transition-colors duration-200 
                                ${activeMenu === item.id ? "bg-[#313338]" : "hover:bg-[#313338] hover:bg-opacity-50"}`}
                        >
                            <img src={item.icon} alt={item.label} className="w-6 m-1 h-auto object-contain opacity-90" />
                            <span className="text-white tracking-wide leading-none text-[11px] text-center mt-1">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full bottom-0 pt-32 mt-auto">
                <div className="h-px w-full bg-[#313338]" />
            </div>
            <div className="mt-auto flex flex-col items-center pt-4 ">
                <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-black">
                SB
                </div>
                <span className="text-gray-400 text-[10px] tracking-wide">
                Logout
                </span>
            </div>
        </aside>
    )
}