import { X, Calendar, Plus, Loader2 } from "lucide-react"
import { useState } from "react"
import { useCreatePoll } from "@/hooks/usePolls"
import { toast } from "sonner"

export default function Poll({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [endDate, setEndDate] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [forAllArticles, setForAllArticles] = useState(false)

  const createPollMut = useCreatePoll()

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("At least 2 options are required")
      return
    }
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }
    const filteredOptions = options.filter(o => o.trim())
    if (filteredOptions.length < 2) {
      toast.error("At least 2 non-empty options are required")
      return
    }
    if (!endDate) {
      toast.error("Poll end date is required")
      return
    }

    createPollMut.mutate({
      title,
      description,
      options: filteredOptions,
      expiresAt: new Date(endDate).toISOString(),
      isActive,
      forAllArticles,
    }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="relative left-48 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded shadow-lg">
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
              <label className="text-[14px] font-semibold text-[#606060]">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full mt-1 px-3 py-2 border rounded text-sm outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter poll question"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[14px] font-semibold text-[#606060]">
                Description
              </label>
              <textarea
                className="w-full mt-1 px-3 py-2 border rounded text-sm outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter poll description (optional)"
              />
            </div>

            {/* Options */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[14px] font-semibold text-[#606060]">
                  Options <span className="text-red-500">*</span>
                </label>
                <button
                  className="text-sm text-blue-600 font-semibold flex items-center gap-1"
                  onClick={addOption}
                >
                  <Plus size={14} /> Add other options
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className="flex items-center border rounded px-3 py-2"
                  >
                    <input type="radio" disabled className="mr-2" />
                    <input
                      className="flex-1 outline-none text-sm"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <button onClick={() => removeOption(index)}>
                      <X className="text-[#606060]" size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Poll End Date */}
            <div>
              <label className="text-[14px] font-semibold text-[#606060]">
                Poll End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border rounded text-sm outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Active
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={forAllArticles}
                  onChange={(e) => setForAllArticles(e.target.checked)}
                />
                Checked for All Articles
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t">
            <button
              className="w-full bg-[#243874] text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={createPollMut.isPending}
            >
              {createPollMut.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
