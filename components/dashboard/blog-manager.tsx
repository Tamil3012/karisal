"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Search, X } from "lucide-react"
import BlogForm from "./blog-form"
import BlogList from "./blog-list"

// Define the Blog type properly
interface Blog {
  id: string
  title: string
  content?: string
  image?: string
  featured: 0 | 1 | boolean
  status: 0 | 1 | boolean
  likes?: number
  stars?: number
  createdAt?: string
  updatedAt?: string
}

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs")
      if (!response.ok) throw new Error("Failed to fetch")
      const data: Blog[] = await response.json()
      setBlogs(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" })
      if (response.ok) {
        setBlogs(blogs.filter((b) => b.id !== id))
        toast({ title: "Success", description: "Blog deleted successfully" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (blogData: Partial<Blog> & { id?: string }) => {
    try {
      const normalizedBlog = {
        ...blogData,
        featured: Number(blogData.featured) === 1 ? 1 : 0,
        status: Number(blogData.status) === 1 ? 1 : 0,
        likes: Number(blogData.likes) || 0,
        stars: Number(blogData.stars) || 0,
      }

      let response
      if (editingBlog) {
        response = await fetch(`/api/admin/blogs/${editingBlog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedBlog),
        })
      } else {
        response = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedBlog),
        })
      }

      if (!response.ok) throw new Error("Save failed")

      const savedBlog: Blog = await response.json()

      if (editingBlog) {
        setBlogs(blogs.map((b) => (b.id === savedBlog.id ? savedBlog : b)))
        toast({ title: "Success", description: "Blog updated successfully" })
      } else {
        setBlogs([...blogs, savedBlog])
        toast({ title: "Success", description: "Blog created successfully" })
      }

      setShowForm(false)
      setEditingBlog(null)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setCurrentPage(1)

    if (value.trim()) {
      const matches = blogs
        .filter((b) => b.title.toLowerCase().includes(value.toLowerCase()))
        .map((b) => b.title)
      setSuggestions([...new Set(matches)].slice(0, 6))
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (title: string) => {
    setSearchQuery(title)
    setSuggestions([])
    setCurrentPage(1)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingBlog(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading blogs...</div>
      </div>
    )
  }

  const totalBlogs = blogs.length
  const activeBlogs = blogs.filter((b) => b.status === 1 || b.status === true).length
  const inactiveBlogs = totalBlogs - activeBlogs

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE))
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Show form only when editing or adding */}
      {showForm ? (
        <div>
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleCloseForm}
            className="mb-6 flex items-center gap-2 hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
            <span>Back to Blog List</span>
          </Button>

          <BlogForm
            blog={editingBlog}
            onSave={handleSave}
            onCancel={handleCloseForm}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Blog Posts</h2>
            <Button
              onClick={() => {
                setShowForm(true)
                setEditingBlog(null)
              }}
              className="!text-white"
            >
              Add New Blog
            </Button>
          </div>

          {/* Stats */}
          <div className="flex space-x-2 mb-6 bg-muted/50 p-4 rounded-lg">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Total Blogs</p>
              <p className="text-2xl font-bold">{totalBlogs}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeBlogs}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{inactiveBlogs}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search blogs by title..."
              className="w-full pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ height: "40px" }}
            />
            
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setSuggestions([])
                  setCurrentPage(1)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Blog List */}
          <div className="mb-10">
            <BlogList
              blogs={paginatedBlogs}
              onEdit={(blog: any) => {
                setEditingBlog(blog)
                setShowForm(true)
              }}
              onDelete={handleDelete}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
