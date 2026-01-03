import { readJsonFile, writeJsonFile, generateId, type Blog, type Comment } from "@/lib/file-utils"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { author, text } = await request.json()

    if (!author || !text) {
      return NextResponse.json({ error: "Author and text required" }, { status: 400 })
    }

    const blogs = await readJsonFile<Blog>("blog.json")
    const blogIndex = blogs.findIndex((b) => b.id === id)

    if (blogIndex === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const newComment: Comment = {
      id: generateId(),
      author,
      text,
      createdAt: new Date().toISOString(),
    }

    if (!blogs[blogIndex].comments) {
      blogs[blogIndex].comments = []
    }

    blogs[blogIndex].comments!.push(newComment)

    const success = await writeJsonFile<Blog>("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/blogs")
    revalidatePath(`/api/blogs/${blogs[blogIndex].slug}`)

    return NextResponse.json(newComment)
  } catch (error) {
    console.error("Add comment error:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
