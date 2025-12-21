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
  status?: boolean
  description?: string
}

interface AllBlogCategoriesProps {
  categories: Category[]
}

export default function AllBlogCategories({ categories }: AllBlogCategoriesProps) {
  const visibleCategories = categories.filter((cat) => cat.status === true)

  if (visibleCategories.length === 0) {
    return null
  }

  return (
    <div className="w-full py-12 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-20 h-20 bg-green-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            With Built In Parental Controls And Monitoring
          </h2>
          <button className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg transition-colors">
            Download App
          </button>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              reverseDirection: false,
            }}
            speed={4000}
            freeMode={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="hanging-cards-swiper"
          >
            {visibleCategories.map((category, index) => (
              <SwiperSlide key={category.id}>
                <Link href={`/categories/${category.slug}`}>
                  <div
                    className="relative pt-8 cursor-pointer"
                    style={{
                      transform: `translateY(${index % 2 === 0 ? "20px" : "0px"})`,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-green-500 rounded-b-lg shadow-md z-20">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-700 rounded-full"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                            <span className="text-white text-xl font-bold text-center px-4">
                              {category.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.description || `Learn about ${category.name.toLowerCase()}`}
                        </p>
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
        .hanging-cards-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  )
}
