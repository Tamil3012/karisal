import { readJsonFile, writeJsonFile, type Blog } from "@/lib/file-utils"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blogs = await readJsonFile<Blog>("blog.json")

    const blogIndex = blogs.findIndex((b) => b.id === id)

    if (blogIndex === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    blogs[blogIndex].likes = (blogs[blogIndex].likes || 0) + 1

    const success = await writeJsonFile<Blog>("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/blogs")
    revalidatePath(`/api/blogs/${blogs[blogIndex].slug}`)

    return NextResponse.json({ likes: blogs[blogIndex].likes })
  } catch (error) {
    console.error("Like blog error:", error)
    return NextResponse.json({ error: "Failed to like blog" }, { status: 500 })
  }
}
