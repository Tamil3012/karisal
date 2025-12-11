"use client"

import { Home, Users, Activity, FileText, Archive, Bell, Mail, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}

export default function DashboardSidebar({ activeTab, setActiveTab, onLogout }: DashboardSidebarProps) {
  const menuItems = [
    {
      section: "ADMIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "users", label: "Users", icon: Users, hasArrow: true },
        { id: "activities", label: "Activities", icon: Activity },
      ],
    },
    {
      section: "BLOG",
      items: [
        { id: "blogs", label: "Post", icon: FileText, hasArrow: true },
        { id: "categories", label: "Categories", icon: Archive },
      ],
    },
    {
      section: "PERSONAL",
      items: [
        { id: "notifications", label: "Notifications", icon: Bell, badge: "5" },
        { id: "links", label: "Links", icon: Mail, badge: "2 New" },
      ],
    },
  ]

  return (
    <div className="w-64 bg-[#f8f4f3] border-r border-gray-200 p-4 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="pb-4 border-b border-b-gray-800 mb-4">
        <h2 className="font-bold text-2xl text-gray-900">
          LOREM <span className="bg-[#f84525] text-white px-2 rounded-md">IPSUM</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        {menuItems.map((section) => (
          <div key={section.section}>
            <p className="text-gray-400 font-bold text-xs uppercase mb-2">{section.section}</p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-md transition font-semibold text-sm ${
                      activeTab === item.id
                        ? "bg-gray-950 text-gray-100"
                        : "text-gray-900 hover:bg-gray-950 hover:text-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.badge === "5"
                              ? "bg-red-200 text-red-600"
                              : "bg-green-200 text-green-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.hasArrow && <ChevronRight size={16} className="text-gray-400" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <Button onClick={onLogout} className="w-full bg-gray-900 hover:bg-gray-950 text-white rounded-md py-2 mt-4">
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>
    </div>
  )
}
