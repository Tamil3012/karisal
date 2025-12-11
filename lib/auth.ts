import crypto from "crypto"

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
