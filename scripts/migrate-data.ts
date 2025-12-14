import { kv } from '@vercel/kv'
import fs from 'fs'
import path from 'path'

async function migrateData() {
  console.log('🚀 Starting data migration to Upstash KV...\n')
  
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
        
        const count = Array.isArray(jsonData) ? jsonData.length : 'object'
        console.log(`✅ Migrated ${filename} - ${count} items`)
      } else {
        await kv.set(filename, [])
        console.log(`⚠️  ${filename} not found, initialized with empty array`)
      }
    } catch (error) {
      console.error(`❌ Error migrating ${filename}:`, error)
    }
  }
  
  console.log('\n🎉 Migration complete!')
  console.log('You can now run: npm run dev\n')
  process.exit(0)
}

migrateData()
