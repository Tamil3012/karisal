"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, X } from "lucide-react"

type LinkItem = {
  id: string
  title: string
  href: string
}

export default function LinkManager() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: "", href: "" })

  const [search, setSearch] = useState("")           // search box value
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchLinks()
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
      setFormData({ title: "", href: "" })
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

  // filter by title for main table
  const filteredLinks = useMemo(() => {
    if (!search.trim()) return links
    return links.filter((l) =>
      l.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [links, search])

  // suggestions list (top 5 by title)
  const suggestions = useMemo(() => {
    if (!search.trim()) return []
    return links
      .filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5)
  }, [links, search])

  const clearSearch = () => {
    setSearch("")
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (item: LinkItem) => {
    // fill search with clicked title and hide suggestions
    setSearch(item.title)
    setShowSuggestions(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Links</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ title: "", href: "" })
          }}
        >
          Add Link
        </Button>
      </div>

      {/* Search box + suggestions */}
      <div className="mb-4 relative max-w-md">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowSuggestions(true)
            }}
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

      {/* Form (Create / Edit) – when open, table is hidden */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
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
                required
              />
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

      {/* Table – hidden while form is open */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  URL
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{link.title}</td>
                  <td className="px-6 py-4 text-blue-600 underline">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.href}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(link.id)
                          setFormData({ title: link.title, href: link.href })
                          setShowForm(true)
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
              {filteredLinks.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
