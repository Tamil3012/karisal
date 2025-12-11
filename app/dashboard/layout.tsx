import type React from "react"
import type { Metadata } from "next"
import "./dashboard.css"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: "noindex, nofollow",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // This layout only needs to wrap children without declaring HTML structure
  return <>{children}</>
}
