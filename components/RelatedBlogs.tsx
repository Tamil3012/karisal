"use client"

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

interface RelatedBlogsProps {
  categoryIds: string[]
  currentBlogId: string
}

interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  images?: string[]
  author?: string
  createdAt: string
  categoryIds: string[]
}

export default function RelatedBlogs({ categoryIds, currentBlogId }: RelatedBlogsProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      setLoading(false)
      return
    }

    const fetchRelatedBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs?status=1`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch blogs")
        }

        const data = await response.json()
        
        const filtered = (data.blogs || [])
          .filter((blog: Blog) => 
            String(blog.id) !== String(currentBlogId) && 
            blog.categoryIds?.some((catId: string) => 
              categoryIds.includes(String(catId))
            )
          )
          .slice(0, 6)
        
        setRelatedBlogs(filtered)
      } catch (error) {
        console.error("Failed to fetch related blogs:", error)
        setRelatedBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedBlogs()  // ✅ FIXED: Correct function name
  }, [categoryIds, currentBlogId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
        ))}
      </div>
    )
  }

  if (relatedBlogs.length === 0) {
    return null
  }

  return (
    <>
      {/* Mobile/Tablet - Swiper */}
      <div className="lg:hidden mb-12">
        <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop={relatedBlogs.length > 1}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          speed={600}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
          }}
          className="related-blogs-swiper"
        >
          {relatedBlogs.map((blog) => (
            <SwiperSlide key={blog.id}>
              <RelatedBlogCard blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop - Sticky Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-[80px]">
          <h3 className="text-xl font-bold mb-6">Related Posts</h3>
          <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
            {relatedBlogs.map((blog) => (
              <RelatedBlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .related-blogs-swiper {
          padding-bottom: 40px !important;
        }
        .related-blogs-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .related-blogs-swiper .swiper-pagination-bullet {
          background: #3b82f6;
          opacity: 0.5;
        }
        .related-blogs-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  )
}

function RelatedBlogCard({ blog }: { blog: Blog }) {
  return (
    <a
      href={`/blog/${blog.slug}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
    >
      {blog.images?.[0] && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.images[0]}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {blog.title}
        </h4>
        {blog.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {blog.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {blog.author && <span>{blog.author}</span>}
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </a>
  )
}
