#!/usr/bin/env node

/**
 * Notify subscribers about a new post
 * 
 * Usage:
 *   node scripts/notify-subscribers.js <post-id>
 * 
 * Example:
 *   node scripts/notify-subscribers.js 2025-12-08
 * 
 * Requires:
 *   - SITE_URL in .env.local (or defaults to https://creaturewai.net)
 *   - NOTIFY_SECRET in .env.local
 */

const fs = require('fs')
const path = require('path')

// Load .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          process.env[key] = valueParts.join('=')
        }
      }
    }
  }
}

async function main() {
  loadEnv()

  const postId = process.argv[2]

  if (!postId) {
    console.error('❌ Usage: node scripts/notify-subscribers.js <post-id>')
    console.error('   Example: node scripts/notify-subscribers.js 2025-12-08')
    process.exit(1)
  }

  const siteUrl = process.env.SITE_URL || 'https://creaturewai.net'
  const notifySecret = process.env.NOTIFY_SECRET

  if (!notifySecret) {
    console.error('❌ NOTIFY_SECRET not found in .env.local')
    process.exit(1)
  }

  // Parse post ID to find the file (format: YYYY-MM-DD)
  const [year, month, day] = postId.split('-')
  const postPath = path.join(__dirname, '..', 'posts', year, month, `${parseInt(day)}.ts`)

  if (!fs.existsSync(postPath)) {
    console.error(`❌ Post file not found: ${postPath}`)
    process.exit(1)
  }

  // Extract title from post file (simple regex, not full TS parsing)
  const postContent = fs.readFileSync(postPath, 'utf-8')
  const titleMatch = postContent.match(/title:\s*["'`]([^"'`]+)["'`]/)
  const title = titleMatch ? titleMatch[1] : postId

  console.log(`📝 Notifying subscribers about: "${title}"`)
  console.log(`   Post ID: ${postId}`)
  console.log(`   URL: ${siteUrl}/post/${postId}`)
  console.log('')

  try {
    const response = await fetch(`${siteUrl}/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${notifySecret}`,
      },
      body: JSON.stringify({
        postId,
        title,
        url: `${siteUrl}/post/${postId}`,
      }),
    })

    // Handle non-JSON responses (e.g., 404 HTML pages)
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`❌ API returned non-JSON response (status ${response.status})`)
      console.error(`   Is the site deployed? Try: vercel --prod`)
      console.error(`   Or test locally: SITE_URL=http://localhost:3000 pnpm notify ${postId}`)
      process.exit(1)
    }

    const result = await response.json()
    console.log(result)

    if (!response.ok) {
      console.error('❌ Failed:', result.error || 'Unknown error')
      process.exit(1)
    }

    console.log('✅ Notifications sent!')
    console.log(`   Sent: ${result.sent}`)
    console.log(`   Failed: ${result.failed}`)
    console.log(`   Total subscribers: ${result.total}`)
    console.log(`   Phones: ${result.phones.join(', ')}`)

    if (result.errors?.length > 0) {
      console.log('')
      console.log('⚠️  Errors:')
      for (const err of result.errors) {
        console.log(`   - ${err}`)
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
    process.exit(1)
  }
}

main()

