import { readJsonFile, type Category } from "@/lib/file-utils"
import { NextResponse } from "next/server"

// Force dynamic to prevent caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const categories = await readJsonFile<Category>("categories.json")
    
    console.log("Fetching categories:", categories.length) // Debug log
    
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
