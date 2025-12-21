"use client"

import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"

type LinkItem = {
  id: string
  title: string
  href: string
  categoryId?: string
}

type Category = {
  id: string
  name: string
  sortOrder?: number
}

export default function AllLinks() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [linksRes, categoriesRes] = await Promise.all([
        fetch("/api/links"),
        fetch("/api/linkcategory"),
      ])

      const linksData = await linksRes.json()
      const categoriesData = await categoriesRes.json()

      setLinks(Array.isArray(linksData) ? linksData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error("Failed to fetch links:", error)
    } finally {
      setLoading(false)
    }
  }

  // Sort categories by sortOrder
  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  )

  // Group links by category
  const linksByCategory = sortedCategories.map((category) => ({
    category,
    links: links.filter((link) => link.categoryId === category.id),
  }))

  // Get uncategorized links
  const uncategorizedLinks = links.filter((link) => !link.categoryId)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 ">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-black">
      {/* Categorized Links */}
      {linksByCategory.map(
        ({ category, links: categoryLinks }) =>
          categoryLinks.length > 0 && (
            <div key={category.id} className="space-y-4">
              {/* Category Name - Bold Black H1 */}
              <h1 className="text-3xl text-white font-bold capitalize">
                {category.name}
              </h1>

              {/* Links List */}
              <ul className="space-y-1 ml-8">
                {categoryLinks.map((link) => (
                  <li key={link.id} className="list-disc text-[#37a6c4]">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center text-lg text-[#37a6c4] font-semibold transition-colors duration-200"
                    >
                      <span className="group-hover:underline capitalize">
                        {link.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
      )}

      {/* Uncategorized Links */}
      {uncategorizedLinks.length > 0 && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-black">Uncategorized</h1>
          <ul className="space-y-3">
            {uncategorizedLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-lg text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <ExternalLink
                    size={18}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="group-hover:underline">{link.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Links */}
      {links.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>No links available</p>
        </div>
      )}
    </div>
  )
}
