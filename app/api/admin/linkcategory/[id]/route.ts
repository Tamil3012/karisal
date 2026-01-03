import { readJsonFile, writeJsonFile, type LinkCategory } from "@/lib/file-utils"
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
    const { name, sortOrder } = await request.json()
    const linkCategories = await readJsonFile<LinkCategory>("link-categories.json")

    const categoryIndex = linkCategories.findIndex((c) => c.id === id)

    if (categoryIndex === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    linkCategories[categoryIndex] = {
      ...linkCategories[categoryIndex],
      name,
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : linkCategories[categoryIndex].sortOrder,
    }

    const success = await writeJsonFile<LinkCategory>("link-categories.json", linkCategories)

    if (!success) {
      return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/linkcategory")

    return NextResponse.json(linkCategories[categoryIndex])
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
    const linkCategories = await readJsonFile<LinkCategory>("link-categories.json")

    const index = linkCategories.findIndex((c) => c.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    linkCategories.splice(index, 1)
    const success = await writeJsonFile<LinkCategory>("link-categories.json", linkCategories)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/linkcategory")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
