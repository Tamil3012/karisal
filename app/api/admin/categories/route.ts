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
    const { name, slug, image } = await request.json()
    const categories = await readJsonFile("categories.json")

    const newCategory = {
      id: generateId(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      image: image || null,
      createdAt: new Date().toISOString(),
    }

    categories.push(newCategory)
    const success = await writeJsonFile("categories.json", categories)

    if (!success) {
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
