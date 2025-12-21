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
    const { title, href, categoryId } = await request.json()
    let links = await readJsonFile("links.json")
    
    if (!Array.isArray(links)) {
      links = []
    }

    const newLink = {
      id: generateId(),
      title,
      href,
      categoryId: categoryId || null,
      createdAt: new Date().toISOString(),
    }

    links.push(newLink)
    const success = await writeJsonFile("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
    }

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}
