import { kv } from '@vercel/kv'
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
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
    // Get current data
    const categories = await kv.get("categories.json")
    
    // Delete and recreate
    await kv.del("categories.json")
    await kv.set("categories.json", categories || [])
    
    return NextResponse.json({ 
      success: true, 
      message: "Cache cleared and reset",
      count: Array.isArray(categories) ? categories.length : 0
    })
  } catch (error) {
    console.error("Clear cache error:", error)
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 })
  }
}
