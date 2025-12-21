import { kv } from '@vercel/kv'

export async function readJsonFile(filename: string) {
  try {
    const data = await kv.get(filename)
    
    // If file doesn't exist and it's link-categories.json, return empty array
    if (!data && filename === 'link-categories.json') {
      await kv.set(filename, [])
      return []
    }
    
    return data || null
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    
    // Return empty array for link-categories.json on error
    if (filename === 'link-categories.json') {
      return []
    }
    
    return null
  }
}

export async function writeJsonFile(filename: string, data: any) {
  try {
    await kv.set(filename, data)
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

export async function ensureUploadsDir() {
  return true
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
