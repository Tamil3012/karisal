"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Bell, Maximize2, LogOut, User, Menu } from "lucide-react"

interface DashboardNavProps {
  userName: string
  userRole: string
  onLogout: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export default function DashboardNav({ userName, userRole, onLogout, sidebarOpen, toggleSidebar }: DashboardNavProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="bg-[#f8f4f3] px-6 py-3 flex items-center shadow-md shadow-black/5 sticky top-0 z-30">
      {/* Always Visible Hamburger */}
      <button
        onClick={toggleSidebar}
        className="text-gray-700 hover:text-gray-900 mr-6"
      >
        <Menu size={28} />
      </button>

      <div className="flex items-center gap-4 ml-auto relative" ref={menuRef}>
        <button className="text-gray-400 hover:text-gray-600 w-10 h-10 flex items-center justify-center rounded">
          <Search size={22} />
        </button>

        <button className="text-gray-400 hover:text-gray-600 w-10 h-10 flex items-center justify-center rounded relative">
          <Bell size={22} />
          <span className="absolute top-1 right-1 w-3 h-3 bg-lime-400 border-2 border-white rounded-full"></span>
        </button>

        <button onClick={toggleFullscreen} className="text-gray-400 hover:text-gray-600 w-10 h-10 flex items-center justify-center rounded">
          <Maximize2 size={22} />
        </button>

        <button
          className="flex items-center gap-3 pl-4 border-l border-gray-300"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <div className="w-10 h-10 relative">
            <div className="p-1 bg-white rounded-full">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {userName?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="top-0 left-7 absolute w-3 h-3 bg-lime-400 border-2 border-white rounded-full animate-ping"></div>
              <div className="top-0 left-7 absolute w-3 h-3 bg-lime-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
          {/* <div className="hidden md:block text-left">
            <h2 className="text-sm font-semibold text-gray-800">{userName}</h2>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div> */}
        </button>

        {openMenu && (
          <div className="absolute right-0 top-16 bg-white shadow-xl rounded-[8px] w-52 z-50 p-[4px]">
            <button className="w-full px-4 py-2 flex items-center gap-2 rounded-[8px] text-gray-700 hover:bg-gray-100">
              <User size={16} /> Profile
            </button>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 flex items-center gap-2 rounded-[8px] text-red-600 hover:bg-red-100"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}