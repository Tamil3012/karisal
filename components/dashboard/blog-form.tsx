"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface BlogFormProps {
  blog: any
  onSave: (data: any) => void
  onCancel: () => void
}

export default function BlogForm({ blog, onSave, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    contentHtml: "",
    author: "",
    status: 1,
    featured: 0,
    categoryIds: [] as string[],
    images: [] as string[],
    video: "",
  })

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
    if (blog) {
      setFormData({
        ...blog,
        categoryIds: blog.categoryIds || [],
        images: blog.images || [],
      })
    }
  }, [blog])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (field: "status" | "featured") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === 1 ? 0 : 1,
    }))
  }

  const handleCategoryToggle = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId],
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of files) {
      const formDataFile = new FormData()
      formDataFile.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataFile,
        })
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.url],
        }))
        toast({ title: "Success", description: "Image uploaded" })
      } catch (error) {
        toast({ title: "Error", description: "Upload failed", variant: "destructive" })
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        {blog ? "Edit Blog" : "Create New Blog"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Author name"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Short description..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Content (HTML)</label>
          <textarea
            name="contentHtml"
            value={formData.contentHtml}
            onChange={handleInputChange}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-vertical"
            placeholder="<h1>Blog content...</h1>"
          />
        </div>

        {/* Toggle Switches - Status & Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="font-semibold text-gray-700">Status</p>
              <p className="text-sm text-gray-500">{formData.status === 1 ? "Published" : "Draft"}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 1}
                onChange={() => handleToggle("status")}
                className="sr-only peer"
              />
              <div className="w-[46px] h-[25px]  bg-gray-300 peer-focus:outline-none peer-focus:ring-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="font-semibold text-gray-700">Featured</p>
              <p className="text-sm text-gray-500">{formData.featured === 1 ? "Yes" : "No"}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured === 1}
                onChange={() => handleToggle("featured")}
                className="sr-only peer"
              />
              <div className="w-[46px] h-[25px]  bg-gray-300 peer-focus:outline-none peer-focus:ring-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" size="lg" className="flex-1">
            {blog ? "Update Blog" : "Create Blog"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}