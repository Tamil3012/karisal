import { readJsonFile, writeJsonFile } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

async function isAdmin() {
  const cookieStore = await cookies()
  return !!cookieStore.get("admin_session")
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const blogs = await readJsonFile("blog.json")

    const blog = blogs.find((b: any) => b.id === id)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    Object.assign(blog, {
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    })

    const success = await writeJsonFile("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const blogs = await readJsonFile("blog.json")

    const index = blogs.findIndex((b: any) => b.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    blogs.splice(index, 1)
    const success = await writeJsonFile("blog.json", blogs)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
