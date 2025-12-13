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
    const categories = await readJsonFile("categories.json")

    const category = categories.find((c: any) => c.id === id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    Object.assign(category, body, { id })

    const success = await writeJsonFile("categories.json", categories)

    if (!success) {
      return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const categories = await readJsonFile("categories.json")

    const index = categories.findIndex((c: any) => c.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    categories.splice(index, 1)
    const success = await writeJsonFile("categories.json", categories)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
