import { readJsonFile } from "@/lib/file-utils"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    let linkCategories = await readJsonFile("link-categories.json")
    
    // Ensure it's an array
    if (!Array.isArray(linkCategories)) {
      linkCategories = []
    }

    return NextResponse.json(linkCategories)
  } catch (error) {
    console.error("Error fetching link categories:", error)
    return NextResponse.json([], { status: 200 })
  }
}
