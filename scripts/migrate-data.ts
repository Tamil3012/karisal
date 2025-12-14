import { kv } from '@vercel/kv'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load .env.local file
dotenv.config({ path: '.env.local' })

async function migrateData() {
  console.log('🚀 Starting data migration to Upstash KV...\n')
  
  // Check if environment variables are loaded
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('❌ Environment variables not found!')
    console.error('Please make sure .env.local exists with:')
    console.error('KV_REST_API_URL and KV_REST_API_TOKEN')
    process.exit(1)
  }
  
  console.log('✓ Environment variables loaded\n')
  
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
