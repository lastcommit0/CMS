import { X, Calendar, Plus } from "lucide-react"
import { useState } from "react"

export default function CreatePoll({ onClose }: { onClose: () => void }) {
  const [options, setOptions] = useState(["Option 1"])

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`])
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-[#243874] font-semibold">Create Poll</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded text-sm outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded text-sm outline-none"
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                Options <span className="text-red-500">*</span>
              </label>
              <button
                className="text-sm text-blue-600 flex items-center gap-1"
                onClick={addOption}
              >
                <Plus size={14} /> Add other options
              </button>
            </div>

            <div className="space-y-2">
              {options.map((opt, index) => (
                <div
                  key={index}
                  className="flex items-center border rounded px-3 py-2"
                >
                  <input type="radio" disabled className="mr-2" />
                  <input
                    className="flex-1 outline-none text-sm"
                    defaultValue={opt}
                  />
                  <button onClick={() => removeOption(index)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Poll End Date */}
          <div>
            <label className="text-sm font-medium">
              Poll End Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="w-full mt-1 px-3 py-2 border rounded text-sm outline-none"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Active
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Checked for All Articles
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t">
          <button className="w-full bg-[#243874] text-white py-2 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
