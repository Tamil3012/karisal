"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"

export default function BlogList({ blogs, onEdit, onDelete }: any) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Featured</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Likes</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Stars</th>
              <th className="px-6 py-3 text-right text-sm font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog: any) => (
              <tr key={blog.id} className="border-b border-gray-200 hover:bg-gray-50">
                {/* Image Column */}
                <td className="px-6 py-4">
                  {blog.images && blog.images.length > 0 ? (
                    <img
                      src={blog.images[0]}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-600 text-center px-1">
                        No Image
                      </span>
                    </div>
                  )}
                </td>

                {/* Title */}
                <td className="px-6 py-4 text-sm font-medium">{blog.title}</td>

                {/* Status */}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      blog.status === 1 || blog.status === true
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {blog.status === 1 || blog.status === true ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Featured */}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      blog.featured === 1 || blog.featured === true
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {blog.featured === 1 || blog.featured === true ? "Yes" : "No"}
                  </span>
                </td>

                {/* Likes */}
                <td className="px-6 py-4 text-sm">{blog.likes || 0}</td>

                {/* Stars */}
                <td className="px-6 py-4 text-sm">{blog.stars || 0}</td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(blog)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(blog.id)}>
                      <Trash2 size={16} className="!text-white" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
