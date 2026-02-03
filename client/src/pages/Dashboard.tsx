import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

import { useRef } from "react"
import { useStoryStats } from "@/hooks/useStories"
import type { Stats } from "@/types/storyTypes"
import StatCard from "@/components/StatsCard"
import pending from "../assets/icons/pending.svg"
import planned from "../assets/icons/planned.svg"
import published from "../assets/icons/published.svg"
import holdReject from "../assets/icons/reject.svg"
import SearchBox from "@/components/SearchBox"


interface NewsItem {
  id: string
  title: string
  timestamp: string
  providedBy: string
  editedBy: string
  desk: string
}


export default function Dashboard() {
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  const endDateRef = useRef<HTMLInputElement>(null)
  const startDateRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [startDate, setStartDate] = useState("2024-01-01")
  const [endDate, setEndDate] = useState("2024-01-30")
  const [productType, setProductType] = useState("story")
  const {
    data: stats,
    isLoading: statsLoading,

  } = useStoryStats()


  const handleGetData = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: debouncedSearch,
        startDate,
        endDate,
        productType
      })

      const response = await fetch(`http://localhost:3000/api/dashboard?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to fetch filtered data')

      const data = await response.json()
      setNewsData(data.news || [])
    } catch (err) {
      console.error('An error occurred:', err)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, startDate, endDate, productType])

  useEffect(() => {
    handleGetData()
  }, [handleGetData])


  return (
    <div className="w-full min-h-screen bg-white ml-36">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 bg-white">
        <h1 className="text-[18px] font-semibold text-[#243874]">
          Dashboard
        </h1>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <SearchBox
            value={searchQuery}
            onChange={(v) => setSearchQuery(v)}
            onSearch={(v) => setDebouncedSearch(v)}
            placeholder="Search by Text or ID"
            className="w-[360px]"
          />

          {/* Mandal */}
          <Select value="mandal" onValueChange={() => { }}>
            <SelectTrigger className="w-[200px] h-9 bg-[#EAEAEA] text-[#606060] rounded-[4px] px-3">
              <SelectValue placeholder="Mandal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mandal">Mandal</SelectItem>
              <SelectItem value="mandal1">Mandal 1</SelectItem>
              <SelectItem value="mandal2">Mandal 2</SelectItem>
            </SelectContent>
          </Select>

          {/* District */}
          <Select value="district" onValueChange={() => { }}>
            <SelectTrigger className="w-[200px] h-9 bg-[#EAEAEA] text-[#606060] rounded-[4px] px-3">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="district">District</SelectItem>
              <SelectItem value="district1">District 1</SelectItem>
              <SelectItem value="district2">District 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-b-2 border-gray-300"></div>
      <main className="mx-6">


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">

          <div className="relative w-full">
            <label className="block text-sm text-[#606060] font-semibold mb-2">
              Start Date
            </label>

            <Input
              ref={startDateRef}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#F8F8F8] border-0 border-b-2 border-gray-200 rounded-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
            />

            <Calendar
              className="absolute right-3 top-[42px] text-[#000000] w-4 h-4 cursor-pointer"
              onClick={() => startDateRef.current?.showPicker()}
            />
          </div>

          {/* End Date */}
          <div className="relative w-full">
            <label className="block text-sm text-[#606060] font-semibold mb-2">
              End Date
            </label>

            <Input
              ref={endDateRef}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#F8F8F8] border-0 border-b-2 border-gray-200 rounded-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
            />

            <Calendar
              className="absolute right-3 top-[42px] text-[#000000] w-4 h-4 cursor-pointer"
              onClick={() => endDateRef.current?.showPicker()}
            />
          </div>

          {/* Product Type */}
          <div className="w-full">
            <label className="block text-sm text-[#606060] font-semibold mb-2">
              Product Type
            </label>

            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger className="w-full bg-[#F8F8F8] border-0 border-b-2 border-gray-200 rounded-none">
                <SelectValue placeholder="Story" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="news">News</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button */}
          <div className="flex items-end w-full">
            <Button
              onClick={handleGetData}
              disabled={loading}
              className="h-8 bg-[#243874] hover:bg-[#243874]/90 text-white rounded-[4px] px-4 w-full md:w-auto"
            >
              Get Data
            </Button>
          </div>

        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Published */}
          <StatCard
            icon={published}
            label="Published"
            value={stats?.published ?? 0}
            loading={statsLoading}
            bg="green"
          />

          {/* Pending */}
          <StatCard
            icon={pending}
            label="Pending"
            value={stats?.pending ?? 0}
            loading={statsLoading}
            bg="orange"
          />

          {/* Planned */}
          <StatCard
            icon={planned}
            label="Planned"
            value={stats?.planned ?? 0}
            loading={statsLoading}
            bg="blue"
          />

          {/* Hold / Reject */}
          <StatCard
            icon={holdReject}
            label="Hold/Reject"
            value={stats?.holdReject ?? 0}
            loading={statsLoading}
            bg="red"
          />
        </div>


        {/* Data Table */}
        <div className="w-full max-w-[1400px] rounded-md border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Header */}
              <thead className="bg-[#F8F8F8] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1E1E1E] w-[110px]">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1E1E1E] w-[420px]">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1E1E1E] w-[210px]">
                    Time Stamp
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1E1E1E] w-[170px]">
                    Provided By
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1E1E1E] w-[170px]">
                    Edited By
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1E1E1E] w-[80px]">
                    Desk
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-gray-200">
                {newsData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  newsData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {item.id}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-900 max-w-[420px] truncate">
                        {item.title}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.timestamp}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.providedBy}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.editedBy}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600 text-center">
                        {item.desk || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}