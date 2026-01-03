"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, Search, X, Upload } from "lucide-react"

export default function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    duration: "",
    reviews: 0,
    rating: 0,
    isMostView: false,
    status: true,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
  try {
    // Use the public API endpoint with cache-busting
    const response = await fetch("/api/categories", {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log("Fetched categories:", data.length) // Debug
    setCategories(data)
  } catch (error) {
    console.error("Fetch error:", error)
    toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" })
  }
}


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, image: data.url })
        toast({ title: "Success", description: "Image uploaded successfully" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleToggleStatus = () => {
    setFormData({ ...formData, status: !formData.status })
  }

  const handleToggleMostView = () => {
    setFormData({ ...formData, isMostView: !formData.isMostView })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const response = await fetch(`/api/admin/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchCategories()
          toast({ title: "Success", description: "Category updated" })
        }
      } else {
        const response = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchCategories()
          toast({ title: "Success", description: "Category created" })
        }
      }
      setShowAddForm(false)
      setShowEditForm(false)
      setEditingId(null)
      setFormData({
        name: "",
        slug: "",
        image: "",
        description: "",
        duration: "",
        reviews: 0,
        rating: 0,
        isMostView: false,
        status: true,
      })
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchCategories()
        toast({ title: "Success", description: "Category deleted" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    }
  }

  const filteredCategories = searchTerm
    ? categories.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories

  // Stats
  const totalCategories = categories.length
  const activeCategories = categories.filter((cat: any) => cat.status === true).length
  const inactiveCategories = totalCategories - activeCategories

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Categories</h2>
        <Button
        className="!text-white"
          onClick={() => {
            setShowAddForm(true)
            setShowEditForm(false)
            setEditingId(null)
            setFormData({
              name: "",
              slug: "",
              image: "",
              description: "",
              duration: "",
              reviews: 0,
              rating: 0,
              isMostView: false,
              status: true,
            })
          }}
        >
          Add Category
        </Button>
      </div>

      {/* Stats */}
      {!showAddForm && !showEditForm && (
        <div className="flex gap-4 mb-6 bg-muted/50 p-4 rounded-lg">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">All Categories</p>
            <p className="text-2xl font-bold">{totalCategories}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCategories}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-red-600">{inactiveCategories}</p>
          </div>
        </div>
      )}

      {(showAddForm || showEditForm) && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  style={{ height: "40px" }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  style={{ height: "40px" }}
                  placeholder="7 Days/6 Night"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reviews</label>
                <input
                  type="number"
                  value={formData.reviews}
                  onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  style={{ height: "40px" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="category-image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="category-image-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  style={{ height: "40px" }}
                >
                  <Upload size={16} />
                  <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                </label>
                {formData.image && (
                  <div className="flex items-center gap-2">
                    <img src={formData.image} alt="Preview" className="w-10 h-10 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Toggle Switches in Edit Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Toggle */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Status</p>
                  <p className="text-sm text-gray-500">{formData.status ? "Active" : "Inactive"}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={handleToggleStatus}
                    className="sr-only peer"
                  />
                  <div className="w-[46px] h-[25px] bg-gray-300 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Most Viewed Toggle */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Most Viewed</p>
                  <p className="text-sm text-gray-500">{formData.isMostView ? "ON" : "OFF"}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMostView}
                    onChange={handleToggleMostView}
                    className="sr-only peer"
                  />
                  <div className="w-[46px] h-[25px] bg-gray-300 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 !text-white" disabled={uploading}>
                {editingId ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setShowEditForm(false)
                  setEditingId(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {!showAddForm && !showEditForm && (
        <>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                style={{ height: "40px" }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Table - Only Show Text (NO Buttons) */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Slug</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold whitespace-nowrap">Most Viewed</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat: any) => (
                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-600 text-center px-1">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">{cat.name}</td>
                      <td className="px-6 py-4 text-gray-600">{cat.slug}</td>
                      
                      {/* Status - Just Text */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            cat.status
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {cat.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Most Viewed - Just Text */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            cat.isMostView
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {cat.isMostView ? "ON" : "OFF"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(cat.id)
                              setFormData({
                                name: cat.name,
                                slug: cat.slug,
                                image: cat.image || "",
                                description: cat.description || "",
                                duration: cat.duration || "",
                                reviews: cat.reviews || 0,
                                rating: cat.rating || 0,
                                isMostView: cat.isMostView || false,
                                status: cat.status !== false,
                              })
                              setShowEditForm(true)
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button size="sm" variant="destructive" className="!text-white" onClick={() => handleDelete(cat.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
