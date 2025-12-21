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
    const { name, sortOrder } = await request.json()
    let linkCategories = await readJsonFile("link-categories.json")

    if (!Array.isArray(linkCategories)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 500 })
    }

    const category = linkCategories.find((c: any) => c.id === id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    category.name = name
    category.sortOrder = sortOrder !== undefined ? parseInt(sortOrder) : category.sortOrder

    const success = await writeJsonFile("link-categories.json", linkCategories)

    if (!success) {
      return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
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
    let linkCategories = await readJsonFile("link-categories.json")

    if (!Array.isArray(linkCategories)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 500 })
    }

    const index = linkCategories.findIndex((c: any) => c.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    linkCategories.splice(index, 1)
    const success = await writeJsonFile("link-categories.json", linkCategories)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
