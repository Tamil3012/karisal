"use client"

import { Home, Users, Activity, FileText, Archive, Bell, Mail, LogOut, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
  isOpen: boolean
  toggleOpen: () => void
}

export default function DashboardSidebar({ activeTab, setActiveTab, onLogout, isOpen, toggleOpen }: DashboardSidebarProps) {
  const menuItems = [
    {
      section: "ADMIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "alllinks", label: "All Links", icon: Home },
      ],
    },
    {
      section: "BLOG",
      items: [
        { id: "blogs", label: "Post", icon: FileText },
        { id: "categories", label: "Categories", icon: Archive },
      ],
    },
    {
      section: "PERSONAL",
      items: [
        // { id: "notifications", label: "Notifications", icon: Bell, badge: "5" },
        { id: "links", label: "Links", icon: Mail, badge: "2 New" },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-[#f8f4f3] border-r border-gray-300">
      <div className="p-3 flex items-center mx-auto justify-between">
        <div className="flex items-center justify-between  w-full ">
          <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-xl">L</span>
          </div>

          <h2 className={`font-black text-2xl tracking-tight text-gray-900 transition-all duration-300 ${isOpen ? "block opacity-100" : "hidden opacity-0"}`}>
            LOREM
          </h2>
        </div>

        <button
          onClick={toggleOpen}
          className="p-2 rounded-lg hover:bg-gray-200 transition md:hidden block mr-2"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      <div className="w-[90%] h-[2px] rounded-[4px] bg-gray-200 mx-auto"></div>

      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.section}>
            {/* Section Title */}
            <p className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2 transition-all duration-300 ${isOpen ? "block opacity-100" : "hidden opacity-0"}`}>
              {section.section}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all font-semibold text-sm group relative
                      ${isActive 
                        ? "bg-gray-950 !text-white shadow-md" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      } ${!isOpen && "justify-center"}`}
                  >
                    {/* Icon + Label */}
                    <div className={`flex items-center ${isOpen ? "gap-3" : "gap-0"}`}>
                      <Icon size={20} className={isActive ? "!text-white" : "text-gray-600"} />
                      <span className={`transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
                        {item.label}
                      </span>
                    </div>

                    {/* Badge & Arrow - Only when open */}
                    <div className={`absolute right-4 flex items-center gap-2 transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
                      {item.badge && (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          item.badge.includes("New")
                            ? "!bg-green-100 !text-green-700"
                            : "!bg-red-100 !text-red-700"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.hasArrow && (
                        <ChevronRight size={16} className={isActive ? "!text-white/70" : "!text-gray-400"} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-300">
        <Button
          onClick={onLogout}
          className={`w-full bg-gray-950 hover:bg-black !text-white font-semibold rounded-lg py-6 flex items-center transition-all ${
            isOpen ? "justify-center gap-3" : "justify-center"
          }`}
        >
          <LogOut size={20} />
          <span className={`transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
            Logout
          </span>
        </Button>
      </div>
    </div>
  )
}