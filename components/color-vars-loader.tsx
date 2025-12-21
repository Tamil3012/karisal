"use client"

import { useEffect } from "react"

export default function ColorVarsLoader() {
  useEffect(() => {
    const loadColors = async () => {
      try {
        const response = await fetch("/api/colors")
        if (!response.ok) return

        const colors = await response.json()
        
        if (colors && typeof colors === "object") {
          Object.entries(colors).forEach(([key, value]) => {
            if (typeof value === "string") {
              document.documentElement.style.setProperty(`--${key}`, value)
            }
          })
        }
      } catch (error) {
        console.error("Failed to load colors:", error)
      }
    }

    loadColors()
  }, []) // Empty dependency array - runs once only

  return null // This component doesn't render anything
}
