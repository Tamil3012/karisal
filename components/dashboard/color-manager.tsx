"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ColorManager() {
  const [colors, setColors] = useState({
    primary: "#1E3A8A",
    secondary: "#06B6D4",
    accent: "#F97316",
    muted: "#6B7280",
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchColors()
  }, [])

  const fetchColors = async () => {
    try {
      const response = await fetch("/api/colors")
      const data = await response.json()
      setColors(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch colors", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = (key: string, value: string) => {
    setColors({ ...colors, [key]: value })
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/colors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colors),
      })

      if (response.ok) {
        // Apply colors immediately to CSS variables
        const root = document.documentElement
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value)
        })

        toast({ title: "Success", description: "Colors updated" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update colors", variant: "destructive" })
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Site Colors</h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-6">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <label className="text-sm font-medium w-24 capitalize">{key}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-bold mb-4">Preview</h3>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="w-16 h-16 rounded-lg shadow" style={{ backgroundColor: value }} />
                <p className="text-xs mt-2 capitalize">{key}</p>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full mt-6">
          Save Colors
        </Button>
      </div>
    </div>
  )
}
