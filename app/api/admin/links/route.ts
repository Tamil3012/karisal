import { readJsonFile, writeJsonFile, generateId, type Link } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/admin-check"

// async function isAdmin() {
//   const cookieStore = await cookies()
//   return !!cookieStore.get("admin_session")
// }

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, href, categoryId } = await request.json()
    const links = await readJsonFile<Link>("links.json")

    const newLink: Link = {
      id: generateId(),
      title,
      href,
      categoryId: categoryId || null,
      createdAt: new Date().toISOString(),
    }

    links.push(newLink)
    const success = await writeJsonFile<Link>("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
    }

    // Invalidate cache
    revalidatePath("/api/links")

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}
