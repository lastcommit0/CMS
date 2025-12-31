import { Loader2 } from "lucide-react"

export default function StatCard({
  icon,
  label,
  value,
  bg,
  loading,
}: {
  icon: string
  label: string
  value: number
  bg: "green" | "orange" | "blue" | "red"
  loading?: boolean
}) {
  const bgMap = {
    green: "bg-green-100",
    orange: "bg-orange-100",
    blue: "bg-blue-100",
    red: "bg-red-100",
  }

  return (
    <div className="h-20 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center">
      <div className={`w-20 h-full ${bgMap[bg]} rounded-l-lg flex items-center justify-center`}>
        <img src={`/icons/${icon}.svg`} className="w-8 h-8" />
      </div>

      <div className="px-4">
        <div className="text-2xl font-bold">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : value}
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}
