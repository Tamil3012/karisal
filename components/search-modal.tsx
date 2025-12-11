"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search } from "lucide-react"
import Link from "next/link"

interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  images: string[]
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const searchBlogs = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/blogs?status=1`)
        const data = await response.json()

        // Filter blogs by title, excerpt
        const filtered = (data.blogs || []).filter(
          (blog: Blog) =>
            blog.title.toLowerCase().includes(query.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(query.toLowerCase()),
        )

        setResults(filtered.slice(0, 8))
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchBlogs, 300)
    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          <div className="p-6 border-b border-gray-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for blogs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none text-lg text-gray-900 placeholder-gray-400"
              autoFocus
            />
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && <div className="p-8 text-center text-gray-400">Searching...</div>}

            {!loading && query && results.length === 0 && (
              <div className="p-8 text-center text-gray-400">No blogs found for "{query}"</div>
            )}

            {!loading && query && results.length > 0 && (
              <div className="p-4 space-y-3">
                {results.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    onClick={onClose}
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      {blog.images && blog.images[0] ? (
                        <img
                          src={blog.images[0] || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
                        {blog.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">{blog.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && !query && (
              <div className="p-8 text-center text-gray-400">Start typing to search for blogs...</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
