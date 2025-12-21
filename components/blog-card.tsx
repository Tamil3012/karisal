"use client"

import Link from "next/link"
import { Heart, Star, MessageCircle } from "lucide-react"

interface BlogCardProps {
  blog: {
    id: string
    slug: string
    title: string
    excerpt?: string
    images?: string[]
    author?: string
    views?: number
    likes?: number
    stars?: number
    comments?: any[]
    createdAt?: string
  }
}

export default function BlogCard({ blog }: BlogCardProps) {
  // Guard clause - prevent rendering if blog is invalid
  if (!blog || !blog.slug) {
    return null
  }

  // ✅ FIXED: Use online placeholder instead of local file
  const imageUrl = blog.images?.[0] || "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image"

  return (
    <Link 
      href={`/blog/${blog.slug}`}
      className="block h-full"
      prefetch={false}
    >
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white h-full flex flex-col">
        {/* Image Section */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={blog.title || "Blog post"}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // ✅ FIXED: Fallback to online placeholder
              const target = e.target as HTMLImageElement
              target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image"
            }}
          />
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          
          {blog.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
              {blog.excerpt}
            </p>
          )}

          {/* Author and Views */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {blog.author && <span className="font-medium">{blog.author}</span>}
            <span>{blog.views || 0} views</span>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {/* Likes */}
            <div className="flex items-center gap-2 text-gray-600">
              <Heart size={16} className="text-red-500" fill="currentColor" />
              <span className="text-sm">{blog.likes || 0}</span>
            </div>

            {/* Stars/Rating */}
            <div className="flex items-center gap-2 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm">{(blog.stars || 0).toFixed(1)}</span>
            </div>

            {/* Comments */}
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle size={16} />
              <span className="text-sm">{blog.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
