import { readJsonFile, writeJsonFile, generateId } from "@/lib/file-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { author, text } = await request.json()

    if (!author || !text) {
      return NextResponse.json({ error: "Author and text required" }, { status: 400 })
    }

    const blogs = await readJsonFile("blog.json")

    if (!blogs) {
      return NextResponse.json({ error: "Blogs not found" }, { status: 404 })
    }

    const blog = blogs.find((b: any) => b.id === id)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const newComment = {
      id: generateId(),
      author,
      text,
      createdAt: new Date().toISOString(),
    }

    if (!blog.comments) {
      blog.comments = []
    }

    blog.comments.push(newComment)

    const success = await writeJsonFile("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
    }

    return NextResponse.json(newComment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
