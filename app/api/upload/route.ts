import { promises as fs } from "fs"
import path from "path"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function isAdmin() {
  const cookieStore = await cookies()
  return !!cookieStore.get("admin_session")
}

export const runtime = "edge";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const uploadDir = path.join(process.cwd(), "public", "uploads")

    await fs.mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, filename)

    await fs.writeFile(filePath, Buffer.from(buffer))

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
    })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
