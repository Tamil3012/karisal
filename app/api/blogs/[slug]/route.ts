// app/api/blogs/[slug]/route.ts
import { readJsonFile } from "@/lib/file-utils"
import { NextResponse } from "next/server"

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const blogs = await readJsonFile("blog.json")

    if (!blogs || !Array.isArray(blogs)) {
      return NextResponse.json({ error: "Blogs data invalid" }, { status: 500 })
    }

    const blog = blogs.find((b: any) => b.slug === slug)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog by slug:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}