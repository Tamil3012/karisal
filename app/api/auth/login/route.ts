import { cookies } from "next/headers"
import { generateSessionToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    if (username !== "Tamil0904" || password !== "Tamil@0904") {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    const sessionToken = generateSessionToken()
    const cookieStore = await cookies()

    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, token: sessionToken })
  } catch (error) {
    console.log("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
