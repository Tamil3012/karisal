"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import BlogCard from "@/components/blog-card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [category, setCategory] = useState<any>(null)
  const [blogs, setBlogs] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, blogRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/blogs?status=1"),
        ])
        const catData = await catRes.json()
        const blogData = await blogRes.json()

        // Filter only active categories
        const activeCategories = catData.filter((c: any) => c.status === true)
        setAllCategories(activeCategories)

        const foundCategory = activeCategories.find((c: any) => c.slug === slug)
        setCategory(foundCategory)

        if (foundCategory) {
          const filteredBlogs = (blogData.blogs || []).filter((blog: any) =>
            blog.categoryIds.includes(foundCategory.id)
          )
          setBlogs(filteredBlogs)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-6">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-24 h-24 rounded-xl object-cover border-4 border-white/20"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-white/90 text-lg">{category.description}</p>
              )}
              <p className="text-white/70 mt-2">{blogs.length} blog posts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Other Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-4 text-gray-800">All Categories</h3>
              <div className="space-y-2">
                {allCategories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      cat.slug === slug
                        ? "bg-blue-500 text-white font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="lg:col-span-3">
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog: any) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">No blogs found in this category yet.</p>
                <p className="text-sm text-gray-500 mt-2">Check back later for new content!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
