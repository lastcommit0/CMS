"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, FileText, Flag, Users, Search, Calendar } from "lucide-react"


const newsData = [
  {
    id: "1998498",
    title: "Noida Bank Employee Booked For Illicitly Transferring Rs...",
    timestamp: "12-Jan-2024 | 08:53 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998499",
    title: "Dunkl Release LIVE Updates: SRK Fans Call Film...",
    timestamp: "13-Jan-2024 | 09:33 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998100",
    title: "There's A Message in The Suspension Spree...",
    timestamp: "14-Jan-2024 | 08:30 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998101",
    title: "How 150 Meetings by Amit Shah and 3,200 Suggestions...",
    timestamp: "14-Jan-2024 | 08:53 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998102",
    title: "US Deepened Partnership with India': Blinken at Year...",
    timestamp: "14-Jan-2024 | 09:53 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998103",
    title: "Covid-19 Live: 2,669 Active Cases in India, 21 People...",
    timestamp: "14-Jan-2024 | 12:55 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998104",
    title: "No Paneer at Indian Wedding? Angry Guests Throw Chairs...",
    timestamp: "15-Jan-2024 | 09:53 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998105",
    title: "Delhi CM Arvind Kejriwal Responds to ED, Calls Summon...",
    timestamp: "16-Jan-2024 | 11:55 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998106",
    title: "Disproportionate Assets Case: TN Minister Ponmudi, Wife...",
    timestamp: "16-Jan-2024 | 03:30 pm",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998107",
    title: "Why Is Kerala at the Forefront Whenever There's A Surge...",
    timestamp: "16-Jan-2024 | 03:45 pm",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998108",
    title: "Tata Harrier and Safari Secure 5-Star Safety Rating...",
    timestamp: "17-Jan-2024 | 09:45 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998109",
    title: "Open Leaders March from Parl to Vijay Chowk Over...",
    timestamp: "17-Jan-2024 | 09:50 am",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
  {
    id: "1998110",
    title: "Why Meteorites Are More Expensive Than Gold...",
    timestamp: "18-Jan-2024 | 12:46 pm",
    providedBy: "Shagun Bhardwaj",
    editedBy: "Shagun Bhardwaj",
    desk: "-",
  },
]

export default function Dashboard() {

  return (
    <div className=" min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        {/* Header */}
        <header className="flex flex-row justify-between bg-white border-b border-gray-200 px-8 pt-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input type="text" placeholder="Search by Text or ID" className="pl-10 bg-gray-50 border-gray-200" />
                </div>

                {/* Mandal Dropdown */}
                <Select defaultValue="mandal">
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Mandal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandal">Mandal</SelectItem>
                    <SelectItem value="mandal1">Mandal 1</SelectItem>
                    <SelectItem value="mandal2">Mandal 2</SelectItem>
                  </SelectContent>
                </Select>

                {/* District Dropdown */}
                <Select defaultValue="district">
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
        </header>
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">

        <div className="">
          {/* Filters Section */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Start Date</label>
                <div className="relative">
                  <Input type="date" defaultValue="2024-01-01" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <Input type="date" defaultValue="2024-01-30" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Product Type</label>
                <Select defaultValue="story">
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

              {/* Get Data Button */}
              <div className="flex items-end">
                <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white">Get Data</Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Published */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">240</div>
                  <div className="text-sm text-gray-500">Published</div>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">16</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </div>

            {/* Planned */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-500">Planned</div>
                </div>
              </div>
            </div>

            {/* Hold/Reject */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">0</div>
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
                  {newsData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.providedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.editedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.desk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
