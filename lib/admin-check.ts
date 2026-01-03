import { isSessionValid, updateSessionActivity } from "@/lib/auth"

export async function isAdmin(): Promise<boolean> {
  try {
    const valid = await isSessionValid()
    
    if (valid) {
      // Update activity timestamp on every admin action
      await updateSessionActivity()
    }
    
    return valid
  } catch (error) {
    console.error("Admin check error:", error)
    return false
  }
}
