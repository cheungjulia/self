"use server"

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

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const domain = new URL(url).hostname.replace(/^www\./, "")
  
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      return { url, title: null, description: null, domain }
    }

    const html = await response.text()
    return extractMetadata(html, url)
  } catch {
    return { url, title: null, description: null, domain }
  }
}

