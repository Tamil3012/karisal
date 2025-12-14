import { kv } from '@vercel/kv'
import fs from 'fs'
import path from 'path'

async function migrateData() {
  console.log('Starting data migration...')
  
  const dataFiles = [
    'blog.json',
    'categories.json',
    'links.json',
    'colorpalate.json'
  ]

  for (const filename of dataFiles) {
    try {
      const filePath = path.join(process.cwd(), 'data', filename)
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const jsonData = JSON.parse(fileContent)
        
        await kv.set(filename, jsonData)
        console.log(`✓ Migrated ${filename} - ${Array.isArray(jsonData) ? jsonData.length : 'N/A'} items`)
      } else {
        // Initialize empty array if file doesn't exist
        await kv.set(filename, [])
        console.log(`✓ Initialized empty ${filename}`)
      }
    } catch (error) {
      console.error(`✗ Error migrating ${filename}:`, error)
    }
  }
  
  console.log('Migration complete!')
  process.exit(0)
}

migrateData()
