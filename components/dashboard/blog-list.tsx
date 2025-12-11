"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"

export default function BlogList({ blogs, onEdit, onDelete }: any) {
  return (
    <div className="bg-white rounded-lg shadow overflow-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Author</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Featured</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Views</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog: any) => (
            <tr key={blog.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{blog.title}</td>
              <td className="px-6 py-4 text-sm">{blog.author}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    blog.status === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {blog.status === 1 ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    blog.featured === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {blog.featured === 1 ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{blog.views || 0}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(blog)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(blog.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
