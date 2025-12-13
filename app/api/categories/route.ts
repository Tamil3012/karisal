import { readJsonFile } from "@/lib/file-utils"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const categories = await readJsonFile("categories.json")
    return NextResponse.json(categories || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
