import { useState, useEffect } from "react";
import { SquarePen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewUser from "./components/NewUser";
import { useUsers } from "@/hooks/useUsers";
import SearchBox from "@/components/SearchBox"

export default function AdminUserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const { data, isLoading, refetch } = useUsers({
    page,
    limit: 10,
    search: searchQuery,
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); 
      refetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openModal = (user?: any) => {
    setEditingUser(user || null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
        <h1 className="text-[18px] font-semibold text-[#243874]">
          Admin User List
        </h1>

        <div className="flex items-center gap-4">
          <SearchBox value={searchQuery} onChange={setSearchQuery} />

          <Button
            onClick={() => openModal()}
            className="bg-[#243874] text-white h-9 px-4 hover:bg-[#243874]/90"
          >
            + New User
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#243874]" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      {searchQuery ? "No users found matching your search" : "No users found"}
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{user.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        {user.roles?.map((r: any) => r.role?.name).join(", ") || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : user.status === "SUSPENDED"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openModal(user)}
                          className="p-1 hover:bg-blue-50 rounded text-gray-600"
                          title="Edit user"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total > pagination.limit && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pagination.limit + 1} to{" "}
                {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (pagination.totalPage || 1) || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {open && (
        <NewUser
          closeModal={closeModal}
          userToEdit={editingUser}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}