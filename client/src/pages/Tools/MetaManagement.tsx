import { useState } from "react"
import { Search, Pencil, X } from "lucide-react"

type MetaEntityType = "STORY" | "CATEGORY" | "SECTION"

interface MetaRecord {
  id: number
  entityType: MetaEntityType
  entityName: string
  metaTitle: string
  metaDescription: string
  status: "ACTIVE" | "INACTIVE"
}

const mockMetaData: MetaRecord[] = [
  {
    id: 1,
    entityType: "STORY",
    entityName: "Noida Bank Employee Booked For Illicit Transfer",
    metaTitle: "Noida Bank Scam Case",
    metaDescription: "Bank employee booked for transferring crores illegally.",
    status: "ACTIVE",
  },
  {
    id: 2,
    entityType: "CATEGORY",
    entityName: "Politics",
    metaTitle: "Latest Political News",
    metaDescription: "Breaking political news from India and the world.",
    status: "INACTIVE",
  },
]

export default function MetaManagement() {
  const [data, setData] = useState<MetaRecord[]>(mockMetaData)
  const [selected, setSelected] = useState<MetaRecord | null>(null)

  return (
    <div className="ml-36 px-6 py-4">
      {/* HEADER */}
      <header className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-[#243874] font-semibold text-lg">
          Meta Management
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#EAEAEA] rounded-sm border-b border-gray-300">
            <input
              placeholder="Search by Text or ID"
              className="px-3 py-2 text-sm bg-transparent outline-none w-64"
            />
            <Search className="mx-3 text-gray-600" size={16} />
          </div>
        </div>
      </header>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Entity Type</th>
              <th className="px-4 py-3 text-left">Entity Name</th>
              <th className="px-4 py-3 text-left">Meta Title</th>
              <th className="px-4 py-3 text-left">Meta Description</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3">{row.entityType}</td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {row.entityName}
                </td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {row.metaTitle}
                </td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {row.metaDescription}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs
                      ${
                        row.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    ● {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelected(row)}
                    className="text-gray-600 hover:text-[#243874]"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {selected && (
        <MetaEditModal
          record={selected}
          onClose={() => setSelected(null)}
          onSave={(updated) => {
            setData((prev) =>
              prev.map((r) => (r.id === updated.id ? updated : r))
            )
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}

/* ---------------- MODAL ---------------- */

function MetaEditModal({
  record,
  onClose,
  onSave,
}: {
  record: MetaRecord
  onClose: () => void
  onSave: (data: MetaRecord) => void
}) {
  const [form, setForm] = useState(record)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="font-semibold text-[#243874]">
            Edit Meta Information
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-5 py-4 space-y-4 text-sm">
          <div>
            <label className="block text-gray-600 mb-1">Entity</label>
            <div className="bg-gray-100 px-3 py-2 rounded">
              {form.entityType} — {form.entityName}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Meta Title *
            </label>
            <input
              value={form.metaTitle}
              onChange={(e) =>
                setForm({ ...form, metaTitle: e.target.value })
              }
              className="w-full border-b bg-gray-100 px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Meta Description *
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) =>
                setForm({ ...form, metaDescription: e.target.value })
              }
              rows={3}
              className="w-full border-b bg-gray-100 px-3 py-2 outline-none resize-none"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.status === "ACTIVE"}
                onChange={() =>
                  setForm({ ...form, status: "ACTIVE" })
                }
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.status === "INACTIVE"}
                onChange={() =>
                  setForm({ ...form, status: "INACTIVE" })
                }
              />
              Inactive
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-5 py-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 text-sm bg-[#243874] text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
