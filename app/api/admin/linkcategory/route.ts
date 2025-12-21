import { readJsonFile, writeJsonFile, generateId } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

async function isAdmin() {
  const cookieStore = await cookies()
  return !!cookieStore.get("admin_session")
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, sortOrder } = await request.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    let linkCategories = await readJsonFile("link-categories.json")
    
    if (!Array.isArray(linkCategories)) {
      linkCategories = []
    }

    const newCategory = {
      id: generateId(),
      name: name.trim(),
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : linkCategories.length,
      createdAt: new Date().toISOString(),
    }

    linkCategories.push(newCategory)
    const success = await writeJsonFile("link-categories.json", linkCategories)

    if (!success) {
      return NextResponse.json({ error: "Failed to save category" }, { status: 500 })
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Error creating link category:", error)
    return NextResponse.json(
      { error: "Failed to create link category" },
      { status: 500 }
    )
  }
}
