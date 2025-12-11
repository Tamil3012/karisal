"use client"

import { useEffect, useState } from "react"

export function useColors() {
  const [colors, setColors] = useState({
    primary: "#1E3A8A",
    secondary: "#06B6D4",
    accent: "#F97316",
    muted: "#6B7280",
  })

  useEffect(() => {
    // Fetch colors and set CSS variables
    const loadColors = async () => {
      try {
        const response = await fetch("/api/colors")
        const data = await response.json()
        setColors(data)
        applyColors(data)
      } catch (error) {
        console.error("Failed to load colors:", error)
      }
    }

    loadColors()
  }, [])

  const applyColors = (palette: any) => {
    const root = document.documentElement
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string)
    })
  }

  return { colors, applyColors }
}
