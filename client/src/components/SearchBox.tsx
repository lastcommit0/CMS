import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"


export default function SearchBox({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder?: string }) {

    return (
        <div className="relative ">
            <Input
                placeholder={placeholder || "Search by Text or ID"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-[360px] h-9 bg-[#F3F3F3] pr-9 rounded-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
    )
}