"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  image?: string
  isMostView?: boolean
  status?: boolean
  description?: string
  duration?: string
  reviews?: number
  rating?: number
}

interface MostViewCategoriesProps {
  categories: Category[]
}

export default function MostViewCategories({ categories }: MostViewCategoriesProps) {
  const visibleCategories = categories.filter(
    (cat) => cat.status === true && cat.isMostView === true
  )

  if (visibleCategories.length === 0) {
    return null
  }

  return (
    <div className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Most Viewed Categories</h2>

        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={5000}
            freeMode={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="infinite-swiper"
          >
            {visibleCategories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link href={`/categories/${category.slug}`}>
                  <div className="bg-white my-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden hover:-translate-y-1">
                    <div className="flex items-center gap-4 p-2">
                      <div className="flex-shrink-0">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xs font-semibold text-center px-2">
                              {category.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {category.name}
                        </h3>
                        <div className="truncate w-[70%]">
                        <h3 className="text-sm text-gray-500 mb-2 truncate ">
                          {category.description}
                        </h3>
                        </div>
                        
                        {/* {category.duration && (
                          <p className="text-sm text-gray-500 mb-2">
                            {category.duration}
                          </p>
                        )} */}

                        {category.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(category.rating!)
                                      ? "text-orange-400 fill-current"
                                      : "text-gray-300 fill-current"
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                              ))}
                            </div>
                            {category.reviews && (
                              <span className="text-xs text-gray-400">
                                ({category.reviews} Reviews)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .infinite-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  )
}
