"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import BlogCard from "@/components/blog-card"
import CreativeIdea from "@/components/CreativeIdea"
import ScrollContent from "@/components/ScrollContent"
import ContactUs from "@/components/ContactUs"
import Loading from "@/components/Loading"
import BannerCarousel from "@/components/BannerCarousel"
import "antd/dist/reset.css"


export default function HomePage() {
  const [featuredBlogs, setFeaturedBlogs] = useState([])
  const [allBlogs, setAllBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured blogs
        const featuredRes = await fetch("/api/blogs?status=1&featured=1")
        const featuredData = await featuredRes.json()
        setFeaturedBlogs(featuredData.blogs || [])

        // Fetch all blogs
        const allRes = await fetch("/api/blogs?status=1")
        const allData = await allRes.json()
        setAllBlogs(allData.blogs || [])

        // Fetch categories
        const catRes = await fetch("/api/categories")
        const catData = await catRes.json()
        setCategories(catData || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredBlogs =
    selectedCategory === "all" ? allBlogs : allBlogs.filter((blog: any) => blog.categoryIds.includes(selectedCategory))

  if (loading) {
    return <div className="text-center py-20">
      Loading..
    </div>
  }

  return (
    <div className="min-h-screen bg-white">


      {/* <BannerCarousel /> */}
      

       <CreativeIdea />


      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
            >
              All
            </Button>
            {categories.map((cat: any) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                size="sm"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Top Picks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.slice(0, 3).map((blog: any) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

       <ScrollContent />

      {/* All Blogs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      {/* <ContactUs/> */}
    </div>
  )
}
