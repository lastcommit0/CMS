import type React from "react"
import logo from "@/assets/icons/logo.svg"

import bgimg from "@/assets/icons/bgimg.svg";
import bgimg2 from "@/assets/icons/bgimg2.svg";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RefreshCw } from "lucide-react"

export default function LoginPage2() {
  const [rememberMe, setRememberMe] = useState(false)
  const [captcha, setCaptcha] = useState("mkfxc")

  const refreshCaptcha = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let newCaptcha = ""
    for (let i = 0; i < 5; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(newCaptcha)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#f6f7f8] rounded flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto"
              />
            </div>
            <h1 className="text-lg font-bold text-gray-900">UTTAR PRADESH TIMES</h1>
          </div>

          {/* Welcome Back */}
          <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-6">Welcome Back</h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm text-gray-700 mb-1">
                User Name
              </label>
              <Input id="username" type="email" placeholder="hannah.green@test.com" className="w-full" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <Input id="password" type="password" placeholder="Password123@" className="w-full" />
            </div>

            <div>
              <label htmlFor="captcha" className="block text-sm text-gray-700 mb-1">
                Security Text
              </label>
              <div className="flex gap-2">
                <Input id="captcha" type="text" placeholder="Enter the shown text" className="flex-1" />
                <div className="flex items-center gap-2 px-4 border border-gray-200 rounded-md bg-white">
                  <span className="font-mono text-lg font-semibold tracking-wider">{captcha}</span>
                  <button type="button" onClick={refreshCaptcha} className="text-blue-600 hover:text-blue-800">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember me on this computer
              </label>
            </div>

            <Button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
              Log in
            </Button>
          </form>
        </div>
      </div>

      <div className="flex w-full overflow-hidden">
        <img
          src={bgimg}
          className="block h-88 shrink-0 -mr-5"
        />
        <img
          src={bgimg2}
          className="block h-88 shrink-0 -ml-6 -mt-1"
        />
      </div>
    </div>
  )
}
