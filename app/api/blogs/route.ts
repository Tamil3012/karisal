import { readJsonFile, type Blog } from "@/lib/file-utils"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const blogs = await readJsonFile<Blog>("blog.json")

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filtered = blogs

    if (status) filtered = filtered.filter((b) => b.status === Number.parseInt(status))
    if (featured) filtered = filtered.filter((b) => b.featured === Number.parseInt(featured))
    if (category) filtered = filtered.filter((b) => b.categoryIds?.includes(category))

    const total = filtered.length
    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)

    return NextResponse.json({
      blogs: paginated,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Fetch blogs error:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
