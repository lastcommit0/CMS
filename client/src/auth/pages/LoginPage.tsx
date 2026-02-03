import type React from "react"
import logo from "@/assets/icons/logo.svg"
import bgimg from "@/assets/icons/bgimg.svg";
import bgimg2 from "@/assets/icons/bgimg2.svg";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom"
import { useIdentifyUser } from "@/hooks/useAuth"


export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false)
  const [identifier, setIdentifier] = useState('');
  const identifyMutation = useIdentifyUser();
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) {
      console.log("Please enter identifier")
      return
    }
    try {
      const data = await identifyMutation.mutateAsync(identifier);

      navigate(
        `/login?identifier=${data.username}&captcha=${data.requireCaptcha}${data.captcha ? `&captchaVal=${data.captcha}` : ""}`
      );
    } catch (err) {
      console.log(err)
    }
  }

  const handleOauthLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };


  return (
    <div className="relative min-h-screen w-full bg-[#f5f5f0] flex flex-col">
      <div className="absolute inset-x-0 top-1/2 z-20 flex justify-center 
                -translate-y-[65%]">
        <div className="w-full max-w-[420px] bg-white rounded-lg shadow-lg px-8 py-7">

          {/* Logo and Title */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#f6f7f8] rounded flex items-center justify-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">UTTAR PRADESH TIMES</h1>
          </div>

          <h2 className="text-3xl font-semibold text-gray-900 mb-8">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact" className="block text-sm text-gray-700 mb-2">
                Phone or Email
              </label>
              <Input id="contact" type="text" placeholder="" className="w-full h-12 bg-gray-50 border-gray-200"
                onChange={(e) => { setIdentifier(e.target.value) }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                className="data-[state=checked]:bg-[#1e3a8a]"
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember me on this computer
              </label>
            </div>

            <Button type="submit" className="w-full h-12 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-medium">
              Continue
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={()=> handleOauthLogin()}
                type="button"
                className="w-14 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Sign in with Google"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="w-14 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Sign in with WhatsApp"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>

              <button
                type="button"
                className="w-14 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Sign in with Apple"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">By signing in, you agree to Terms & Policy</p>
          </form>
        </div>
      </div>

      <div className="absolute flex h-80 w-full bottom-0 overflow-hidden">
        <img
          src={bgimg}
          className="block h-88 shrink-0 -mr-5 object-cover"
        />
        <img
          src={bgimg2}
          className="block h-88 shrink-0 -ml-6 -mt-1"
        />
      </div>
    </div>
  )
}
