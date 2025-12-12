import { readJsonFile, writeJsonFile, generateId, generateSlug } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

async function isAdmin() {
  const cookieStore = await cookies()
  return !!cookieStore.get("admin_session")
}

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const blogs = await readJsonFile("blog.json")
    return NextResponse.json(blogs || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const blogs = await readJsonFile("blog.json")

    const newBlog = {
      id: generateId(),
      slug: generateSlug(body.title),
      title: body.title,
      excerpt: body.excerpt || "",
      contentHtml: body.contentHtml || "",
      images: body.images || [],
      video: body.video || "",
      likes: 0,
      stars: 0,
      comments: [],
      author: body.author || "Anonymous",
      status: body.status || 1,
      featured: body.featured || 0,
      categoryIds: body.categoryIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    }

    blogs.push(newBlog)
    const success = await writeJsonFile("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
    }

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
