import { readJsonFile, writeJsonFile } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

async function isAdmin() {
  const cookieStore = await cookies()
  return !!cookieStore.get("admin_session")
}

export const runtime = "edge";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const links = await readJsonFile("links.json")

    const link = links.find((l: any) => l.id === id)

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    Object.assign(link, body, { id })

    const success = await writeJsonFile("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
    }

    return NextResponse.json(link)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const links = await readJsonFile("links.json")

    const index = links.findIndex((l: any) => l.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    links.splice(index, 1)
    const success = await writeJsonFile("links.json", links)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
  }
}
