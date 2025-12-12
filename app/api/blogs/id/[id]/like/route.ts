import { readJsonFile, writeJsonFile } from "@/lib/file-utils"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blogs = await readJsonFile("blog.json")

    if (!blogs) {
      return NextResponse.json({ error: "Blogs not found" }, { status: 404 })
    }

    const blog = blogs.find((b: any) => b.id === id)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    blog.likes = (blog.likes || 0) + 1

    const success = await writeJsonFile("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
    }

    return NextResponse.json({ likes: blog.likes })
  } catch (error) {
    return NextResponse.json({ error: "Failed to like blog" }, { status: 500 })
  }
}
