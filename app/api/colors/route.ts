import { readJsonFile } from "@/lib/file-utils"
import { NextResponse } from "next/server"

export const runtime = "edge";

export async function GET() {
  try {
    const colors = await readJsonFile("colorpalate.json")
    return NextResponse.json(colors || {})
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch colors" }, { status: 500 })
  }
}
