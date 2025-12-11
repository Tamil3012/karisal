import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")

export async function readJsonFile(filename: string) {
  try {
    const filePath = path.join(dataDir, filename)
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return null
  }
}

export async function writeJsonFile(filename: string, data: any) {
  try {
    const filePath = path.join(dataDir, filename)
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true })
    // Write with formatting
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

export async function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(uploadsDir, { recursive: true })
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
