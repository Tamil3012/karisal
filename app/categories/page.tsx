"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import BlogCard from "@/components/blog-card"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [blogs, setBlogs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, blogRes] = await Promise.all([fetch("/api/categories"), fetch("/api/blogs?status=1")])
        const catData = await catRes.json()
        const blogData = await blogRes.json()
        setCategories(catData)
        setBlogs(blogData.blogs || [])
        if (catData.length > 0) {
          setSelectedCategory(catData[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  const filteredBlogs = selectedCategory
    ? blogs.filter((blog: any) => blog.categoryIds.includes(selectedCategory))
    : blogs

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Categories</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-4">Filter by Category</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(null)}
                  className="w-full justify-start"
                >
                  All Categories ({blogs.length})
                </Button>
                {categories.map((cat: any) => {
                  const count = blogs.filter((b: any) => b.categoryIds.includes(cat.id)).length
                  return (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "default" : "ghost"}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="w-full justify-start"
                    >
                      {cat.name} ({count})
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Content - Blog List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBlogs.map((blog: any) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            {filteredBlogs.length === 0 && (
              <div className="text-center py-12 text-gray-600">No blogs found in this category.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
