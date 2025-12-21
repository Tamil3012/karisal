"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, X, Plus, Settings, Download, Upload, ChevronLeft, ChevronRight } from "lucide-react"
import * as XLSX from "xlsx"

type LinkItem = {
  id: string
  title: string
  href: string
  categoryId?: string
  createdAt: string
}

type Category = {
  id: string
  name: string
  sortOrder?: number
}

export default function LinkManager() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ 
    title: "", 
    href: "",
    categoryId: ""
  })
  const [categoryFormData, setCategoryFormData] = useState({ 
    name: "",
    sortOrder: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { toast } = useToast()

  useEffect(() => {
    fetchLinks()
    fetchCategories()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links")
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch links",
        variant: "destructive",
      })
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/linkcategory")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch link categories",
        variant: "destructive",
      })
    }
  }

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = links.map((link) => {
        const category = categories.find((c) => c.id === link.categoryId)
        return {
          "Link Name": link.title,
          "URL": link.href,
          "Category": category ? category.name : "Uncategorized",
          "Sort Order": category ? category.sortOrder || 0 : 0,
        }
      })

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Links")

      worksheet["!cols"] = [
        { wch: 30 },
        { wch: 50 },
        { wch: 20 },
        { wch: 12 },
      ]

      XLSX.writeFile(workbook, `links-export-${Date.now()}.xlsx`)

      toast({
        title: "Success",
        description: "Links exported to Excel successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export to Excel",
        variant: "destructive",
      })
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        setSelectedFile(file)
      } else {
        toast({
          title: "Error",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        })
      }
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        setSelectedFile(file)
      } else {
        toast({
          title: "Error",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        })
      }
    }
  }

  // Import from Excel
  const handleImportExcel = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        let successCount = 0
        let errorCount = 0

        for (const row of jsonData) {
          const linkName = row["Link Name"]
          const url = row["URL"]
          const categoryName = row["Category"]
          const sortOrder = row["Sort Order"]

          if (!linkName || !url) {
            errorCount++
            continue
          }

          let category = categories.find(
            (c) => c.name.toLowerCase() === categoryName?.toLowerCase()
          )

          if (!category && categoryName && categoryName !== "Uncategorized") {
            const categoryResponse = await fetch("/api/admin/linkcategory", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: categoryName,
                sortOrder: sortOrder || 0,
              }),
            })

            if (categoryResponse.ok) {
              const newCategory = await categoryResponse.json()
              category = newCategory
              categories.push(newCategory)
            }
          }

          const linkResponse = await fetch("/api/admin/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: linkName,
              href: url,
              categoryId: category?.id || null,
            }),
          })

          if (linkResponse.ok) {
            successCount++
          } else {
            errorCount++
          }
        }

        await fetchLinks()
        await fetchCategories()

        toast({
          title: "Import Complete",
          description: `Imported ${successCount} links successfully. ${errorCount} errors.`,
        })

        setShowImportModal(false)
        setSelectedFile(null)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import Excel file",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }

    reader.readAsArrayBuffer(selectedFile)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: categoryFormData.name,
        sortOrder: categoryFormData.sortOrder === "" ? 0 : parseInt(categoryFormData.sortOrder)
      }

      if (editingCategoryId) {
        const response = await fetch(`/api/admin/linkcategory/${editingCategoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          fetchCategories()
          toast({ title: "Success", description: "Link category updated" })
          setShowCategoryForm(false)
          setEditingCategoryId(null)
          setCategoryFormData({ name: "", sortOrder: "" })
        }
      } else {
        const response = await fetch("/api/admin/linkcategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          fetchCategories()
          toast({ title: "Success", description: "Link category created" })
          setShowCategoryForm(false)
          setCategoryFormData({ name: "", sortOrder: "" })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create link category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Links will become uncategorized.")) return
    try {
      const response = await fetch(`/api/admin/linkcategory/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchCategories()
        toast({ title: "Success", description: "Category deleted" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id)
    setCategoryFormData({
      name: category.name,
      sortOrder: category.sortOrder !== undefined ? category.sortOrder.toString() : "",
    })
    setShowCategoryForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const response = await fetch(`/api/admin/links/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchLinks()
          toast({ title: "Success", description: "Link updated" })
        }
      } else {
        const response = await fetch("/api/admin/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchLinks()
          toast({ title: "Success", description: "Link created" })
        }
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ title: "", href: "", categoryId: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this link?")) return
    try {
      const response = await fetch(`/api/admin/links/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchLinks()
        toast({ title: "Success", description: "Link deleted" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete",
        variant: "destructive",
      })
    }
  }

  const filteredLinks = useMemo(() => {
    if (!search.trim()) return links
    return links.filter((l) =>
      l.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [links, search])

  // Pagination calculations
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLinks = filteredLinks.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const clearSearch = () => {
    setSearch("")
  }

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized"
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  )

  return (
    <div>
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Links</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="flex items-center gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="flex items-center gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Import Excel</span>
            <span className="sm:hidden">Import</span>
          </Button>
          <Button
            onClick={() => {
              setShowCategoryManager(!showCategoryManager)
              setShowCategoryForm(false)
              setShowForm(false)
            }}
            variant="outline"
            className="flex items-center gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <Settings size={16} />
            <span className="hidden md:inline">Category Manager</span>
            <span className="md:hidden">Manager</span>
          </Button>
          <Button
            onClick={() => {
              setShowCategoryForm(true)
              setShowForm(false)
              setShowCategoryManager(false)
              setEditingCategoryId(null)
              setCategoryFormData({ name: "", sortOrder: "" })
            }}
            variant="outline"
            className="flex items-center gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Category</span>
          </Button>
          <Button
            onClick={() => {
              setShowForm(true)
              setShowCategoryForm(false)
              setShowCategoryManager(false)
              setEditingId(null)
              setFormData({ title: "", href: "", categoryId: "" })
            }}
            className="text-xs sm:text-sm !text-white"
            size="sm"
          >
            <Plus size={16} className="mr-1 !text-white" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-60 p-4">
          <div className="sm:max-w-lg w-full p-6 sm:p-10 bg-white rounded-xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
                Import Excel File
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Upload your Excel file with Link Name, URL, Category, and Sort Order columns
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 space-y-2">
                <label className="text-sm font-bold text-gray-500 tracking-wide">
                  {selectedFile ? "Selected File" : "Attach Excel Document"}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label 
                    className={`flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center cursor-pointer transition-colors ${
                      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="h-full w-full text-center flex flex-col items-center justify-center">
                      {selectedFile ? (
                        <div className="text-center">
                          <div className="text-green-500 mb-2">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="font-semibold text-gray-700 break-all">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-auto max-h-48 w-2/5 mx-auto">
                            <img 
                              className="object-center h-36" 
                              src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg" 
                              alt="Upload" 
                            />
                          </div>
                          <p className="pointer-none text-gray-500 text-sm">
                            <span className="text-sm">Drag and drop</span> files here <br /> 
                            or <span className="text-blue-600 hover:underline">select a file</span> from your computer
                          </p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                <span>File type: Excel (.xlsx, .xls)</span>
              </p>

              {isUploading && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Importing...</span>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={handleImportExcel}
                  disabled={!selectedFile || isUploading}
                  className="flex-1 flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                <button 
                  onClick={() => {
                    setShowImportModal(false)
                    setSelectedFile(null)
                  }}
                  disabled={isUploading}
                  className="flex-1 flex justify-center bg-gray-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-600 shadow-lg cursor-pointer transition ease-in duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search box */}
      <div className="mb-4 relative max-w-md">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Manager Panel */}
      {showCategoryManager && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Manage Categories</h3>
            <Button
              onClick={() => setShowCategoryManager(false)}
              size="sm"
              variant="ghost"
            >
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-2">
            {sortedCategories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories yet</p>
            ) : (
              <div className="space-y-2">
                {sortedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        #{category.sortOrder || 0}
                      </span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          handleEditCategory(category)
                          setShowCategoryManager(false)
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Form */}
      {showCategoryForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingCategoryId ? "Edit Link Category" : "Create Link Category"}
          </h3>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={categoryFormData.name}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                style={{ height: "40px" }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort Order</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={categoryFormData.sortOrder}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || /^\d+$/.test(value)) {
                    setCategoryFormData({ ...categoryFormData, sortOrder: value })
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                style={{ height: "40px" }}
                placeholder="Enter number (e.g., 0, 1, 2...)"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first (0 = first)</p>
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editingCategoryId ? "Update Category" : "Create Category"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCategoryForm(false)
                  setEditingCategoryId(null)
                  setCategoryFormData({ name: "", sortOrder: "" })
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Link Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Link" : "Create Link"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                style={{ height: "40px" }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                value={formData.href}
                onChange={(e) =>
                  setFormData({ ...formData, href: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                style={{ height: "40px" }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                style={{ height: "40px" }}
              >
                <option value="">Select a category</option>
                {sortedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editingId ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
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

      {/* Table with Pagination */}
      {!showForm && !showCategoryForm && !showCategoryManager && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLinks.map((link) => (
                    <tr key={link.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{link.title}</td>
                      <td className="px-6 py-4 text-blue-600 underline">
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-800 break-all"
                        >
                          {link.href}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm whitespace-nowrap">
                          {getCategoryName(link.categoryId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(link.id)
                              setFormData({ 
                                title: link.title, 
                                href: link.href,
                                categoryId: link.categoryId || ""
                              })
                              setShowForm(true)
                              setShowCategoryForm(false)
                              setShowCategoryManager(false)
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(link.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedLinks.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No links found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Only show if more than 5 items */}
          {filteredLinks.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-4 px-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLinks.length)} of {filteredLinks.length} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  PREVIOUS
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border border-gray-300 rounded text-sm ${
                        currentPage === page
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
