"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

import BlogManager from "@/components/dashboard/blog-manager";
import CategoryManager from "@/components/dashboard/category-manager";
import ColorManager from "@/components/dashboard/color-manager";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import LinkManager from "@/components/dashboard/link-manager";
import DashboardHeader from "@/components/header";
import DashboardNav from "./DashboardNav";
import AllLinks from "@/components/dashboard/AllLinks";

interface BlogStats {
  totalBlogs: number;
  totalCategories: number;
  totalLinks: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<BlogStats>({
    totalBlogs: 0,
    totalCategories: 0,
    totalLinks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start expanded on large screens

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [blogsRes, categoriesRes, linksRes] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/categories"),
          fetch("/api/links"),
        ]);

        if (!blogsRes.ok || !categoriesRes.ok || !linksRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const blogs = await blogsRes.json();
        const categories = await categoriesRes.json();
        const links = await linksRes.json();

        setStats({
          totalBlogs: Array.isArray(blogs)
            ? blogs.filter((b: any) => b.status === 1).length
            : 0,
          totalCategories: Array.isArray(categories) ? categories.length : 0,
          totalLinks: Array.isArray(links) ? links.length : 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard stats",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast({ title: "Success", description: "Logged out successfully" });
        router.push("/dashboard/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Logout failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, collapsible on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-[999] bg-[#f8f4f3] border-r border-gray-300 flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}
          lg:relative lg:z-auto lg:translate-x-0
        `}
      >
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          toggleOpen={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Always-Visible Hamburger */}
        <div className="sticky top-0 z-40 bg-white ">
          <DashboardNav
            userName="Admin User"
            userRole="Administrator"
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-10 max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-md shadow-black/5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        {loading ? (
                          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          <div className="text-3xl font-bold text-gray-900">
                            {stats.totalBlogs}
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-500 mt-1">
                          Total Published Blogs
                        </p>
                      </div>
                      <span className="text-4xl">Pen</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("blogs")}
                      className="text-red-600 font-medium text-sm hover:text-red-700 transition"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-md shadow-black/5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        {loading ? (
                          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          <div className="text-3xl font-bold text-gray-900">
                            {stats.totalCategories}
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-500 mt-1">
                          Categories
                        </p>
                      </div>
                      <span className="text-4xl">Folder</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("categories")}
                      className="text-red-600 font-medium text-sm hover:text-red-700 transition"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-md shadow-black/5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        {loading ? (
                          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          <div className="text-3xl font-bold text-gray-900">
                            {stats.totalLinks}
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-500 mt-1">
                          Useful Links
                        </p>
                      </div>
                      <span className="text-4xl">Link</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("links")}
                      className="text-red-600 font-medium text-sm hover:text-red-700 transition"
                    >
                      View all →
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-md shadow-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="text-sm text-gray-600">
                    {loading ? (
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                      </div>
                    ) : (
                      <p>Blog created or updated • Just now</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "blogs" && <BlogManager />}
            {activeTab === "alllinks" && <AllLinks />}
            {activeTab === "categories" && <CategoryManager />}
            {activeTab === "links" && <LinkManager />}
            {activeTab === "colors" && <ColorManager />}
          </div>
        </main>
      </div>
    </div>
  );
}