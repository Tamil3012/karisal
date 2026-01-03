import { readJsonFile, writeJsonFile, type Blog } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/admin-check"

// async function isAdmin() {
//   const cookieStore = await cookies()
//   return !!cookieStore.get("admin_session")
// }

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const blogs = await readJsonFile<Blog>("blog.json")

    const blogIndex = blogs.findIndex((b) => b.id === id)

    if (blogIndex === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    blogs[blogIndex] = {
      ...blogs[blogIndex],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    }

    const success = await writeJsonFile<Blog>("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/blogs")
    revalidatePath(`/api/blogs/${blogs[blogIndex].slug}`)

    return NextResponse.json(blogs[blogIndex])
  } catch (error) {
    console.error("Update blog error:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const blogs = await readJsonFile<Blog>("blog.json")

    const index = blogs.findIndex((b) => b.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    blogs.splice(index, 1)
    const success = await writeJsonFile<Blog>("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/blogs")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete blog error:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
