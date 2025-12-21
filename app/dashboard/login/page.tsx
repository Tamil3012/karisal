"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Logged in successfully" })
        router.push("/dashboard")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log("[v0] Login error:", error)
      toast({ title: "Error", description: "Login failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
        <div className="hidden lg:flex flex-col justify-center items-start p-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Edit Smarter. Export Faster. Create Anywhere.</h1>
            <p className="text-lg text-blue-100">
              From quick social media clips to full-length videos, our powerful editor lets you work seamlessly across
              devices.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Log in to your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 !text-white rounded-lg font-medium"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">
                <strong>Demo Credentials:</strong> Username:{" "}
                <code className="bg-white px-2 py-1 rounded text-blue-600">Tamil0904</code> Password:{" "}
                <code className="bg-white px-2 py-1 rounded text-blue-600">Tamil@0904</code>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
