import { useState } from "react";
import { Search, SquarePen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserFormState } from "@/types/userTypes";
import NewUser from "./components/NewUser";
import { useUsers } from "@/hooks/useUsers";



export default function AdminUserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormState | null>(null);
  const [users, setUsers] = useState<UserFormState[]>([]);
  const data = useUsers().data?.users || [];
  

  const openModal = (user?: UserFormState) => {
    setEditingUser(user || null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingUser(null);
  };
  
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
        <h1 className="text-[18px] font-semibold text-[#243874]">
          Admin User List
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[360px] h-9 bg-[#EAEAEA] pr-9"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          <Button
            onClick={() => openModal()}
            className="bg-[#243874] text-white h-9 px-4 hover:bg-[#243874]/90"
          >
            + New User
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* Table */}
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Bio
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  data.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{user.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{user.firstName + " " + user.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm">{user.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {user.bio}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-start gap-2">
                          <button
                            onClick={() => openModal(user)}
                            className="p-1 hover:bg-blue-50 rounded text-gray-600"
                            title="Edit user"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <NewUser
          closeModal={closeModal}
          modalType={editingUser}
          users={users}
        />
      )}
    </div>
  );
}