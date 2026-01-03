import { readJsonFile, writeJsonFile, type Link } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/admin-check"

// async function isAdmin() {
//   const cookieStore = await cookies()
//   return !!cookieStore.get("admin_session")
// }

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
    const links = await readJsonFile<Link>("links.json")

    const linkIndex = links.findIndex((l) => l.id === id)

    if (linkIndex === -1) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    links[linkIndex] = {
      ...links[linkIndex],
      title,
      href,
      categoryId: categoryId || null,
    }

    const success = await writeJsonFile<Link>("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/links")

    return NextResponse.json(links[linkIndex])
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
    const links = await readJsonFile<Link>("links.json")

    const index = links.findIndex((l) => l.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    links.splice(index, 1)
    const success = await writeJsonFile<Link>("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/links")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
  }
}
