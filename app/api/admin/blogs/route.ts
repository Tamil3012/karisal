import { readJsonFile, writeJsonFile, generateId, generateSlug, type Blog } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/admin-check"

// async function isAdmin() {
//   const cookieStore = await cookies()
//   return !!cookieStore.get("admin_session")
// }

export async function GET(request: NextRequest) {
  try {
    const blogs = await readJsonFile<Blog>("blog.json")
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Fetch blogs error:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const blogs = await readJsonFile<Blog>("blog.json")

    const newBlog: Blog = {
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
    const success = await writeJsonFile<Blog>("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/blogs")

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    console.error("Create blog error:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
