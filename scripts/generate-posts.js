#!/usr/bin/env node
/**
 * Auto-generates posts/index.ts by scanning the posts directory.
 * Derives id and date from file path (e.g., posts/2025/11/24.ts → id: "2025-11-24", date: "November 24, 2025")
 * 
 * Run: node scripts/generate-posts.js
 */

const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.join(__dirname, '..', 'posts')
const OUTPUT_FILE = path.join(POSTS_DIR, 'index.ts')

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function findPostFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory()) {
      findPostFiles(fullPath, files)
    } else if (entry.name.match(/^\d+\.ts$/) && !entry.name.includes('index')) {
      files.push(fullPath)
    }
  }
  
  return files
}

function formatTime(date) {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // 0 becomes 12
  const minutesStr = minutes < 10 ? '0' + minutes : minutes
  return `${hours}:${minutesStr} ${ampm}`
}

function parsePostPath(filePath) {
  // Extract year/month/day from path like posts/2025/11/24.ts
  const relativePath = path.relative(POSTS_DIR, filePath)
  const match = relativePath.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})\.ts$/)
  
  if (!match) {
    console.warn(`Warning: Could not parse date from ${relativePath}`)
    return null
  }
  
  const [, year, month, day] = match
  const y = parseInt(year)
  const m = parseInt(month)
  const d = parseInt(day)
  
  // Get file modification time for auto-generated time
  const stats = fs.statSync(filePath)
  const time = formatTime(stats.mtime)
  
  return {
    year: y,
    month: m,
    day: d,
    id: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    date: `${MONTHS[m - 1]} ${d}, ${y}`,
    time: time,
    importPath: `./${relativePath.replace(/\.ts$/, '').replace(/\\/g, '/')}`,
    varName: `post${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`
  }
}

function generateIndex() {
  const postFiles = findPostFiles(POSTS_DIR)
  const posts = postFiles
    .map(parsePostPath)
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by date descending (newest first)
      if (a.year !== b.year) return b.year - a.year
      if (a.month !== b.month) return b.month - a.month
      return b.day - a.day
    })

  if (posts.length === 0) {
    console.log('No posts found.')
    return
  }

  const imports = posts
    .map(p => `import { post as ${p.varName} } from "${p.importPath}"`)
    .join('\n')

  const postsArray = posts
    .map(p => `  { id: "${p.id}", date: "${p.date}", time: "${p.time}", ...${p.varName} }`)
    .join(',\n')

  const content = `// AUTO-GENERATED - Do not edit manually
// Run: node scripts/generate-posts.js

import type { BlogPost } from "@/lib/blog-data"

${imports}

export const posts: BlogPost[] = [
${postsArray},
]
`

  fs.writeFileSync(OUTPUT_FILE, content)
  console.log(`Generated ${OUTPUT_FILE} with ${posts.length} posts`)
}

generateIndex()

