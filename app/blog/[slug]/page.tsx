"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Heart, Star, MessageCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import RelatedBlogs from "@/components/RelatedBlogs"

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [commentAuthor, setCommentAuthor] = useState("")
  const [commentText, setCommentText] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (!slug) return

    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`)
        if (!response.ok) {
          throw new Error("Blog not found")
        }
        const data = await response.json()
        setBlog(data)
      } catch (error) {
        console.error("Failed to fetch blog:", error)
        toast({ 
          title: "Error", 
          description: "Failed to load blog", 
          variant: "destructive" 
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug, toast])

  const handleLike = async () => {
    if (!blog) return
    try {
      const response = await fetch(`/api/blogs/${blog.id}/like`, { 
        method: "POST" 
      })
      const data = await response.json()
      setBlog({ ...blog, likes: data.likes })
      toast({ title: "Success", description: "Liked!" })
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to like", 
        variant: "destructive" 
      })
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentAuthor || !commentText || !blog) {
      toast({ 
        title: "Error", 
        description: "Please fill all fields", 
        variant: "destructive" 
      })
      return
    }

    try {
      const response = await fetch(`/api/blogs/${blog.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: commentAuthor, text: commentText }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setBlog({
          ...blog,
          comments: [...(blog.comments || []), newComment],
        })
        setCommentAuthor("")
        setCommentText("")
        toast({ title: "Success", description: "Comment added!" })
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to add comment", 
        variant: "destructive" 
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="text-center py-20 text-gray-600">
        Blog not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <span className="font-semibold">{blog.author}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  <span>{blog.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.images?.[0] && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={blog.images[0]}
                  alt={blog.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
            />

            {/* Video */}
            {blog.video && (
              <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
                <video controls className="w-full" src={blog.video} />
              </div>
            )}

            {/* Image Gallery */}
            {blog.images?.length > 1 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {blog.images.slice(1).map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="rounded-lg w-full h-40 object-cover shadow hover:shadow-lg transition-shadow cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Engagement */}
            <div className="bg-gray-50 rounded-lg p-6 mb-12">
              <h3 className="font-bold mb-4">Engagement</h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className="gap-2 bg-transparent hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-colors"
                >
                  <Heart size={18} />
                  {blog.likes || 0} Likes
                </Button>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md">
                  <Star size={18} className="text-yellow-500" fill="currentColor" />
                  <span>{(blog.stars || 0).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md">
                  <MessageCircle size={18} />
                  <span>{blog.comments?.length || 0} Comments</span>
                </div>
              </div>
            </div>

            {/* Related Blogs - Mobile/Tablet Only */}
            {blog.categoryIds && Array.isArray(blog.categoryIds) && blog.categoryIds.length > 0 && (
              <div className="lg:hidden mb-12">
                <RelatedBlogs 
                  categoryIds={blog.categoryIds} 
                  currentBlogId={blog.id} 
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">
                Comments ({blog.comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="bg-gray-50 rounded-lg p-6 mb-8 shadow">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment *</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-24 resize-none transition-all"
                    placeholder="Write your comment here..."
                    required
                  />
                </div>
                <Button type="submit" variant="default">
                  Post Comment
                </Button>
              </form>

              {/* Comments List */}
              {blog.comments?.length > 0 ? (
                <div className="space-y-4">
                  {blog.comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800">{comment.author}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <MessageCircle size={48} className="mx-auto mb-2 text-gray-400" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Blogs Sidebar - Desktop Only */}
          {blog.categoryIds && Array.isArray(blog.categoryIds) && blog.categoryIds.length > 0 && (
            <div className="hidden lg:block">
              <RelatedBlogs 
                categoryIds={blog.categoryIds} 
                currentBlogId={blog.id} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
