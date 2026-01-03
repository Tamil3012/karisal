import { generateSessionToken, createSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    // Validate credentials
    if (username !== "Tamil0904" || password !== "Tamil@0904") {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Create session with activity tracking (use the function from lib/auth)
    const sessionToken = generateSessionToken()
    await createSession(sessionToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
