"use client"

import Link from "next/link"
import { Heart, Star, MessageCircle } from "lucide-react"

export default function BlogCard({ blog }: { blog: any }) {
  const imageUrl = blog.images?.[0] || "/blog-post.jpg"

  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white h-full flex flex-col">
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{blog.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span>{blog.author}</span>
            <span>{blog.views || 0} views</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Heart size={16} fill="currentColor" />
              <span className="text-sm">{blog.likes || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm">{(blog.stars || 0).toFixed(1)}</span>
            </div>
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
