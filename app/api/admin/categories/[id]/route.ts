import { readJsonFile, writeJsonFile, type Category } from "@/lib/file-utils"
import { isAdmin } from "@/lib/admin-check"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const categories = await readJsonFile<Category>("categories.json")

    const categoryIndex = categories.findIndex((c) => c.id === id)

    if (categoryIndex === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: body.name,
      slug: body.slug,
      image: body.image || null,
      description: body.description || null,
      duration: body.duration || null,
      reviews: body.reviews || 0,
      rating: body.rating || 0,
      isMostView: body.isMostView || false,
      status: body.status !== false,
      updatedAt: new Date().toISOString(),
    }

    const success = await writeJsonFile<Category>("categories.json", categories)

    if (!success) {
      return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
    }

    revalidatePath("/api/categories")
    revalidatePath("/api/admin/categories")

    return NextResponse.json(categories[categoryIndex])
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const categories = await readJsonFile<Category>("categories.json")

    const index = categories.findIndex((c) => c.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    categories.splice(index, 1)
    const success = await writeJsonFile<Category>("categories.json", categories)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }

    revalidatePath("/api/categories")
    revalidatePath("/api/admin/categories")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
