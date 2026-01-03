import crypto from "crypto"
import { cookies } from "next/headers"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function verifyAdminPassword(password: string): boolean {
  const hashedEnvPassword = hashPassword(ADMIN_PASSWORD)
  return hashPassword(password) === hashedEnvPassword
}

// Session management interfaces and functions
export interface SessionData {
  token: string
  createdAt: number
  lastActivity: number
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin_session")
    
    if (!sessionCookie) return null
    
    const session: SessionData = JSON.parse(sessionCookie.value)
    return session
  } catch (error) {
    // If parsing fails, clear the cookie
    try {
      const cookieStore = await cookies()
      cookieStore.delete("admin_session")
    } catch {
      // Ignore error if already deleted
    }
    return null
  }
}

export async function isSessionValid(): Promise<boolean> {
  try {
    const session = await getSession()
    
    if (!session) return false
    
    const now = Date.now()
    const TEN_MINUTES = 10 * 60 * 1000 // 10 minutes in milliseconds
    
    // Check if last activity was more than 10 minutes ago
    if (now - session.lastActivity > TEN_MINUTES) {
      // Session expired, clear it
      await destroySession()
      return false
    }
    
    return true
  } catch (error) {
    console.error("Session validation error:", error)
    return false
  }
}

export async function updateSessionActivity(): Promise<void> {
  try {
    const session = await getSession()
    
    if (!session) return
    
    const cookieStore = await cookies()
    const updatedSession: SessionData = {
      ...session,
      lastActivity: Date.now(),
    }
    
    cookieStore.set("admin_session", JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
  } catch (error) {
    console.error("Update session activity error:", error)
  }
}

export async function createSession(token: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    
    const sessionData: SessionData = {
      token,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    }
    
    cookieStore.set("admin_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
  } catch (error) {
    console.error("Create session error:", error)
    throw error
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("admin_session")
  } catch (error) {
    console.error("Destroy session error:", error)
  }
}
