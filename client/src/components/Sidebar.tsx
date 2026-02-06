import logo from "../assets/icons/logo.svg";
import layout from "../assets/icons/layout.svg";
import users from "../assets/icons/users.svg";
import text from "../assets/icons/text.svg";
import tool from "../assets/icons/tool.svg";
import huge from "../assets/icons/huge.svg";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/auth/AuthContext";


const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: layout,
    path: "/user/dashboard",
  },
  {
    id: "stories",
    label: "Story Management",
    icon: text,
    path: "/user/stories",
    subItems: [
      { label: "Add Story", path: "add" },
      { label: "View Story", path: "view" },
      { label: "View Schedule Story", path: "view-schedule" },
      { label: "E-Paper PDF List", path: "pdf-list" },
      { label: "Create Poll", path: "create-poll" },
      { label: "Video List", path: "video-list" },
      { label: "Contact List", path: "contact-list" },
    ],
  },
  {
    id: "priority",
    label: "Priority Management",
    icon: huge,
    path: "/user/priority",
  },
  {
    id: "tools",
    label: "Tools",
    icon: tool,
    path: "/user/tools",
    subItems: [
      { label: "Category Management", path: "category-management" },
      { label: "Meta Management", path: "meta-management" },
      { label: "Download Report", path: "download-report" },
    ],
  },
  {
    id: "users",
    label: "User Management",
    icon: users,
    path: "/user/users",
    subItems: [
      { label: "User Access Management", path: "user-access-management" },
      { label: "Admin User List", path: "admin-user-list" },
      { label: "Users", path: "users" },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const logout = useLogout();
  const { user } = useAuthContext();

  const activeMenu = menuItems.find(item =>
    location.pathname.startsWith(item.path)
  );


  const handleLogout = () => {
    logout.mutate();
  }

  const avatarUrl = user?.profile?.avatar;
  const name = user?.name?.trim() || "";
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join("") || "U";

  return (
    <div className="fixed top-0 flex min-h-screen">
      <aside className="w-[142px] h-screen bg-[#1c1c1f] text-white flex flex-col items-center py-6">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex items-center gap-2">
            <img src={logo} className="w-11" />
            <h3 className="font-logo text-xs uppercase font-semibold leading-none">
              <span>Uttar</span>
              <span className="block">Pradesh</span>
              <span>Times</span>
            </h3>
          </div>

          <div className="flex flex-col gap-2 w-full px-2">
            {menuItems.map(item => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 rounded-md transition
                  ${isActive ? "bg-[#35353a]" : "hover:bg-[#313338]/60"}`
                }
              >
                <img src={item.icon} className="w-6 opacity-90" />
                <span className="text-[11px] text-center">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <button className="mt-auto flex flex-col items-center gap-2" onClick={handleLogout}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || "User avatar"}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black text-xs">
              {initials}
            </div>
          )}
          <span className="text-[10px] text-gray-400">Logout</span>
        </button>
      </aside>
      <div className="bg-black">
        {activeMenu?.subItems && (
          <aside className="w-[240px] h-full bg-[#1c1c1f] border-r border-gray-700/30 pt-4">
            {activeMenu.subItems.map(sub => (
              <NavLink
                key={sub.path}
                to={`${activeMenu.path}/${sub.path}`}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-md mx-2 mb-1 transition
                ${isActive ? "bg-[#242428] text-white" : "text-gray-300 hover:bg-[#313338]/60"}`
                }
              >
                {sub.label}
              </NavLink>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
