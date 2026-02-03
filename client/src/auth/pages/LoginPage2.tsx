import type React from "react"
import logo from "@/assets/icons/logo.svg"

import bgimg from "@/assets/icons/bgimg.svg"
import bgimg2 from "@/assets/icons/bgimg2.svg"
import CaptchaCanvas from "@/components/CaptchaCanvas"


import { useLogin, useCaptcha } from "@/hooks/useAuth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RefreshCw } from "lucide-react"
import { useSearchParams, useNavigate } from "react-router-dom"


export default function LoginPage2() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const identifier = searchParams.get("identifier") || ""
  const captchaRequired = searchParams.get("captcha") === "true"
  const captchaVal = searchParams.get("captchaVal") || ""
  const loginMutation = useLogin()
  const captchaMutation = useCaptcha()

  const [password, setPassword] = useState("")
  const [captcha, setCaptcha] = useState(captchaVal)
  const [captchaInput, setCaptchaInput] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const refreshCaptcha = async () => {
    try {
      const newVal = await captchaMutation.mutateAsync()
      setCaptcha(newVal)
    } catch (err) {
      console.error("Failed to refresh captcha:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      alert("Password required")
      return
    }
    console.log("Captcha Required: ", captchaRequired)
    console.log("Captcha Input: ", captchaInput)
    console.log("Captcha: ", captcha)
    if (captchaRequired && captchaInput !== captcha) {
      refreshCaptcha()
      alert("Invalid captcha")
      return
    }

    try {
      await loginMutation.mutateAsync({
        identifier,
        password,
        captcha: captchaRequired ? captchaInput : undefined
      })



      navigate("/user/dashboard")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f5f5f0] flex flex-col">
      <div className="absolute inset-x-0 top-1/2 z-20 flex justify-center -translate-y-[75%]">
        <div className="w-full max-w-[420px] bg-white rounded-lg shadow-lg px-8 py-7">

          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#f6f7f8] rounded flex items-center justify-center">
              <img src={logo} className="h-8" />
            </div>
            <h1 className="text-lg font-bold">UTTAR PRADESH TIMES</h1>
          </div>

          <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-4">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-[#1e3a8a] text-sm mb-1">User Name</label>
              <Input value={identifier} readOnly
                placeholder="hannah.green@test.com"
                className="rounded py-5"
              />
            </div>

            <div>
              <label className="block text-[#1e3a8a] text-sm mb-1">Password</label>
              <Input
                type="password"
                value={password}
                placeholder="Password@123"
                onChange={e => setPassword(e.target.value)}
                className="rounded py-5"
              />
            </div>

            <div>
              <label className="block text-[#1e3a8a] text-sm mb-1">Security Text</label>
              <div className="flex gap-2">
                <Input
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  placeholder="Enter the shown text"
                  className="rounded py-5"
                />
                <div className="flex items-center gap-3 px-3 border rounded bg-white relative">
                  <CaptchaCanvas value={captcha} />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="absolute right-1 text-[#1e3a8a] p-1.5 rounded-full transition-colors"
                    title="Refresh Captcha"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={v => setRememberMe(v as boolean)}
              />
              <label className="text-sm">Remember me</label>
            </div>

            <Button type="submit" className="w-full bg-[#1e3a8a]">
              Log in
            </Button>
          </form>
        </div>
      </div>

      <div className="absolute flex w-full bottom-0 overflow-hidden">
        <img src={bgimg} className="h-88 -mr-5" />
        <img src={bgimg2} className="h-88 -ml-6" />
      </div>
    </div>
  )
}
