/**
 * Link metadata utilities for fetching and parsing Open Graph data
 * 
 * Uses open-graph-scraper for robust metadata extraction.
 * Runs on the server during SSR/SSG build time.
 */

import ogs from 'open-graph-scraper'

export interface LinkMetadata {
  url: string
  title: string | null
  description: string | null
  domain: string
}

/**
 * Fetch metadata for a single URL using open-graph-scraper
 * Handles OG tags, Twitter cards, and fallbacks automatically
 */
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const domain = new URL(url).hostname.replace(/^www\./, "")
  
  try {
    const { result } = await ogs({ 
      url,
      timeout: 10000,
      fetchOptions: {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      },
    })

    // open-graph-scraper provides multiple fallback fields
    const title = result.ogTitle 
      || result.twitterTitle 
      || result.dcTitle 
      || null

    const description = result.ogDescription 
      || result.twitterDescription 
      || result.dcDescription 
      || null

    // If we got valid metadata, return it
    if (title) {
      return { url, title, description, domain }
    }

    // Fallback: extract readable title from URL slug
    return { url, title: extractTitleFromUrl(url), description: null, domain }
  } catch {
    // On error, try to extract title from URL slug
    return { url, title: extractTitleFromUrl(url), description: null, domain }
  }
}

/**
 * Extract readable title from URL slug (fallback for stubborn sites)
 * "some-article-title" → "Some Article Title"
 */
function extractTitleFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname
    const segments = pathname.split("/").filter(s => s && s.length > 0)
    
    // Find the segment most likely to be the article title
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i]
      // Skip numeric segments, dates, short segments
      if (/^\d+$/.test(seg) || /^\d{4}-\d{2}-\d{2}/.test(seg) || seg.length < 5) continue
      
      // Remove file extension and convert slug to title
      const cleaned = seg.replace(/\.(html?|php|aspx?)$/i, "")
      if (cleaned.length < 5) continue
      
      // Convert "some-article-title" → "Some Article Title"
      const words = cleaned.replace(/[-_]/g, " ").split(" ").filter(w => w.length > 0)
      if (words.length === 0) continue
      
      const LOWERCASE_WORDS = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"]
      const titleWords = words.map((word, i) => {
        const lower = word.toLowerCase()
        if (i > 0 && LOWERCASE_WORDS.includes(lower)) return lower
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      
      return titleWords.join(" ")
    }
    return null
  } catch {
    return null
  }
}

/**
 * Extract all URLs from a post's content and sources
 */
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

/**
 * Pre-fetch metadata for multiple URLs in parallel
 * Returns a map of URL → LinkMetadata for efficient lookup
 */
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
