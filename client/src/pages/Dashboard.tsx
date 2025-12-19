import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, FileText, Calendar, Search, Loader2 } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  timestamp: string
  providedBy: string
  editedBy: string
  desk: string
}

interface DashboardStats {
  published: number
  pending: number
  planned: number
  holdReject: number
}

export default function Dashboard() {
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    published: 0,
    pending: 0,
    planned: 0,
    holdReject: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("2024-01-01")
  const [endDate, setEndDate] = useState("2024-01-30")
  const [productType, setProductType] = useState("story")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:3000/api/dashboard', {
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setNewsData(data.news || [])
      setStats(data.stats || { published: 0, pending: 0, planned: 0, holdReject: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: searchQuery,
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
      setStats(data.stats || stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading && newsData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="ml-36 min-h-screen bg-gray-50">
      <main className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          <div className="w-full md:w-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Search by Text or ID" 
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value="mandal" onValueChange={() => {}}>
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Mandal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mandal">Mandal</SelectItem>
                <SelectItem value="mandal1">Mandal 1</SelectItem>
                <SelectItem value="mandal2">Mandal 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value="district" onValueChange={() => {}}>
              <SelectTrigger className="bg-gray-50 border-gray-200">
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Start Date</label>
              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-50 border-gray-200" 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">End Date</label>
              <Input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-50 border-gray-200" 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Product Type</label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Story" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleGetData}
                disabled={loading}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Get Data'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.published}</div>
                <div className="text-sm text-gray-500">Published</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.planned}</div>
                <div className="text-sm text-gray-500">Planned</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.holdReject}</div>
                <div className="text-sm text-gray-500">Hold/Reject</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Time Stamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Provided By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Edited By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Desk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newsData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  newsData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.providedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.editedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.desk}</td>
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