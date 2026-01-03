import { writeJsonFile } from "@/lib/file-utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-check"

// async function isAdmin() {
//   const cookieStore = await cookies()
//   return !!cookieStore.get("admin_session")
// }

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const colors = await request.json()
    const success = await writeJsonFile("colorpalate.json", colors)

    if (!success) {
      return NextResponse.json({ error: "Failed to update colors" }, { status: 500 })
    }

    return NextResponse.json(colors)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update colors" }, { status: 500 })
  }
}
