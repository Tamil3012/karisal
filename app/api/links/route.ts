import { readJsonFile } from "@/lib/file-utils"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const links = await readJsonFile("links.json")
    return NextResponse.json(links || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
  }
}
