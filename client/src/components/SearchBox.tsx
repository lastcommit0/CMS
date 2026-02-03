import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"

interface SearchBoxProps {
    value?: string
    onChange?: (v: string) => void
    onSearch?: (v: string) => void
    placeholder?: string
    debounceDelay?: number
    className?: string
}

export default function SearchBox({
    value: externalValue,
    onChange,
    onSearch,
    placeholder,
    debounceDelay = 500,
    className
}: SearchBoxProps) {
    const [inputValue, setInputValue] = useState(externalValue || "")
    const debouncedValue = useDebounce(inputValue, debounceDelay)

    useEffect(() => {
        if (externalValue !== undefined) {
            setInputValue(externalValue)
        }
    }, [externalValue])

    useEffect(() => {
        if (onSearch) {
            onSearch(debouncedValue)
        }
    }, [debouncedValue, onSearch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)
        if (onChange) {
            onChange(newValue)
        }
    }

    return (
        <div className={`relative ${className || ""}`}>
            <Input
                placeholder={placeholder || "Search by Text or ID"}
                value={inputValue}
                onChange={handleChange}
                className="w-[360px] h-9 bg-[#F3F3F3] pr-9 rounded-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
    )
}