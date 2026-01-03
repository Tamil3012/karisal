import { readJsonFile, writeJsonFile, generateId, type Category } from "@/lib/file-utils"
import { isAdmin } from "@/lib/admin-check"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const categories = await readJsonFile<Category>("categories.json")
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Admin fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const categories = await readJsonFile<Category>("categories.json")

    const newCategory: Category = {
      id: generateId(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      image: body.image || null,
      description: body.description || null,
      duration: body.duration || null,
      reviews: body.reviews || 0,
      rating: body.rating || 0,
      isMostView: body.isMostView || false,
      status: body.status !== false,
      createdAt: new Date().toISOString(),
    }

    categories.push(newCategory)
    const success = await writeJsonFile<Category>("categories.json", categories)

    if (!success) {
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }

    revalidatePath("/api/categories")
    revalidatePath("/api/admin/categories")

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Create error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
