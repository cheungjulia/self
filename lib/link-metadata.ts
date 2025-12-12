/**
 * Link metadata utilities for fetching and parsing Open Graph data
 * 
 * These functions run on the server during SSR/SSG build time.
 * No "use server" directive needed since they're called from Server Components.
 */

export interface LinkMetadata {
  url: string
  title: string | null
  description: string | null
  domain: string
}

// Decode HTML entities like &quot; &#39; &amp; etc.
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&quot;": '"',
    "&apos;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
  }
  return text
    .replace(/&(?:#(\d+)|#x([0-9a-f]+)|(\w+));/gi, (match, dec, hex, named) => {
      if (dec) return String.fromCharCode(parseInt(dec, 10))
      if (hex) return String.fromCharCode(parseInt(hex, 16))
      return entities[`&${named};`] ?? match
    })
}

// Extract Open Graph and meta tags from HTML
function extractMetadata(html: string, url: string): LinkMetadata {
  const domain = new URL(url).hostname.replace(/^www\./, "")
  
  // Extract og:title or <title>
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1]
    ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
    ?? null

  // Extract og:description or meta description
  const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1]
    ?? html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)?.[1]
    ?? null

  return {
    url,
    title: ogTitle ? decodeHtmlEntities(ogTitle.trim()) : null,
    description: ogDesc ? decodeHtmlEntities(ogDesc.trim()) : null,
    domain,
  }
}

// Handle X.com/Twitter via oEmbed (their public API)
async function fetchTwitterMetadata(url: string): Promise<LinkMetadata> {
  const domain = "x.com"
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`
    const response = await fetch(oembedUrl, {
      next: { revalidate: 86400 },
    })
    
    if (!response.ok) {
      // Fallback: extract username from URL
      const match = url.match(/(?:x\.com|twitter\.com)\/([^\/\?]+)/)
      const username = match?.[1]
      return { url, title: username ? `@${username}` : null, description: null, domain }
    }

    const data = await response.json()
    // oEmbed returns author_name (username) and html (tweet content)
    const author = data.author_name ?? null
    // Extract text from tweet HTML (remove links and tags), then decode entities
    const rawText = data.html
      ?.replace(/<[^>]+>/g, "")
      ?.replace(/&mdash;.*$/, "")
      ?.trim()
    const tweetText = rawText ? decodeHtmlEntities(rawText).slice(0, 93) : null
    
    return {
      url,
      title: tweetText || (author ? `@${author}` : null),
      description: author ? `@${author}` : null,
      domain,
    }
  } catch {
    return { url, title: null, description: null, domain }
  }
}

// User agents to try - Googlebot often allowed for SEO, then browser fallback
const USER_AGENTS = [
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]

// Check if metadata looks like a generic/blocked response
function isGenericMetadata(metadata: LinkMetadata, domain: string): boolean {
  if (!metadata.title) return true
  const title = metadata.title.toLowerCase()
  // Detect generic paywall/login/captcha page titles
  const genericPatterns = [
    /^subscribe/i,
    /^sign in/i,
    /^log in/i,
    /^access denied/i,
    /^403/i,
    /^error/i,
    /^please enable/i,
  ]
  // Also check if title is just the domain name (common bot-blocked response)
  const isDomainOnly = title === domain.toLowerCase() || 
    title === domain.replace(/\.com$|\.org$|\.net$/i, "").toLowerCase()
  return genericPatterns.some(pattern => pattern.test(title)) || isDomainOnly
}

// Extract readable title from URL slug (fallback for bot-protected sites)
function extractTitleFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname
    
    // Get the last meaningful path segment (skip dates, IDs, etc.)
    const segments = pathname.split("/").filter(s => s && s.length > 0)
    
    // Find the segment most likely to be the article title
    // Usually it's the last segment, or second-to-last if last is an ID
    let titleSegment: string | null = null
    
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i]
      // Skip numeric segments (dates, IDs), file extensions, short segments
      if (/^\d+$/.test(seg)) continue
      if (/^\d{4}-\d{2}-\d{2}/.test(seg)) continue
      if (seg.length < 5) continue
      // Remove file extension
      const cleaned = seg.replace(/\.(html?|php|aspx?)$/i, "")
      if (cleaned.length < 5) continue
      titleSegment = cleaned
      break
    }
    
    if (!titleSegment) return null
    
    // Convert slug to readable title: "some-article-title" -> "Some Article Title"
    const words = titleSegment
      .replace(/[-_]/g, " ")
      .split(" ")
      .filter(w => w.length > 0)
      .map(word => {
        // Don't capitalize short words unless they're first
        const lower = word.toLowerCase()
        if (["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"].includes(lower)) {
          return lower
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
    
    if (words.length === 0) return null
    // Always capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    
    return words.join(" ")
  } catch {
    return null
  }
}

// Extract all URLs from a post's content and sources
export function extractUrlsFromPost(content: string, sources?: string[]): string[] {
  const urls: Set<string> = new Set()
  const urlRegex = /https?:\/\/[^\s]+/g
  
  // Extract from content
  let match
  while ((match = urlRegex.exec(content)) !== null) {
    urls.add(match[0])
  }
  
  // Extract from sources
  if (sources) {
    for (const source of sources) {
      urlRegex.lastIndex = 0
      while ((match = urlRegex.exec(source)) !== null) {
        urls.add(match[0])
      }
    }
  }
  
  return Array.from(urls)
}

// Pre-fetch metadata for multiple URLs in parallel
// Returns a map of URL -> LinkMetadata for efficient lookup
export async function prefetchMetadataForUrls(urls: string[]): Promise<Map<string, LinkMetadata>> {
  const results = await Promise.allSettled(
    urls.map(async (url) => ({ url, metadata: await fetchLinkMetadata(url) }))
  )
  
  const metadataMap = new Map<string, LinkMetadata>()
  for (const result of results) {
    if (result.status === 'fulfilled') {
      metadataMap.set(result.value.url, result.value.metadata)
    }
  }
  
  return metadataMap
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const parsedUrl = new URL(url)
  const domain = parsedUrl.hostname.replace(/^www\./, "")
  
  // Special handling for X.com / Twitter
  if (domain === "x.com" || domain === "twitter.com") {
    return fetchTwitterMetadata(url)
  }
  
  // Try each user agent until we get good metadata
  for (const userAgent of USER_AGENTS) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      })

      if (!response.ok) continue

      const html = await response.text()
      const metadata = extractMetadata(html, url)
      
      // If we got good metadata, return it
      if (!isGenericMetadata(metadata, domain)) {
        return metadata
      }
    } catch {
      continue
    }
  }
  
  // Fallback: extract title from URL slug (works for paywalled/bot-protected sites)
  const urlTitle = extractTitleFromUrl(url)
  return { url, title: urlTitle, description: null, domain }
}

