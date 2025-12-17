"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import SearchModal from "./search-modal"
import { Search, Bell } from "lucide-react"

export default function Header() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify")
        setIsAuthenticated(response.ok)
      } catch (error) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "var(--color-primary)" }} />
              <span className="font-bold text-lg">Blog Hub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                Categories
              </Link>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900">
                ContactUs
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>

              {isAuthenticated ? (
                <Link href="/dashboard" target="blank">
                  <Button className="!text-white" variant="default" size="sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard/login" target="blank">
                  <Button variant="default" size="sm">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
