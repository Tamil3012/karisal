import { readJsonFile, writeJsonFile } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

async function isAdmin() {
  const cookieStore = await cookies()
  return !!cookieStore.get("admin_session")
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { title, href, categoryId } = await request.json()
    let links = await readJsonFile("links.json")

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 500 })
    }

    const link = links.find((l: any) => l.id === id)

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    link.title = title
    link.href = href
    link.categoryId = categoryId || null

    const success = await writeJsonFile("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error("Error updating link:", error)
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    let links = await readJsonFile("links.json")

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 500 })
    }

    const index = links.findIndex((l: any) => l.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    links.splice(index, 1)
    const success = await writeJsonFile("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
  }
}
