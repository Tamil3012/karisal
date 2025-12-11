"use client"

import { useEffect } from "react"

export default function ColorVarsLoader() {
  useEffect(() => {
    const loadColors = async () => {
      try {
        const response = await fetch("/api/colors")
        const colors = await response.json()

        const root = document.documentElement
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value as string)
        })
      } catch (error) {
        console.error("Failed to load colors:", error)
      }
    }

    loadColors()
  }, [])

  return null
}
