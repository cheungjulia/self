"use client"

import { useEffect, useState } from "react"
import type { LinkMetadata } from "@/lib/link-metadata"

interface LinkPreviewProps {
  url: string
  prefixText?: string // Text before the URL (e.g., quotes from the source)
  prefetchedMetadata?: LinkMetadata // Pre-fetched metadata from SSR (preferred)
  fetchMetadata?: (url: string) => Promise<LinkMetadata> // Fallback for client-side fetch
}

export function LinkPreview({ url, prefixText, prefetchedMetadata, fetchMetadata }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(prefetchedMetadata ?? null)
  const [loading, setLoading] = useState(!prefetchedMetadata)

  // Only fetch on client if no pre-fetched metadata was provided
  useEffect(() => {
    if (prefetchedMetadata || !fetchMetadata) return
    
    fetchMetadata(url)
      .then(setMetadata)
      .finally(() => setLoading(false))
  }, [url, fetchMetadata, prefetchedMetadata])

  // Safely extract domain with fallback for malformed URLs
  const domain = metadata?.domain ?? (() => {
    try { return new URL(url).hostname.replace(/^www\./, "") }
    catch { return url }
  })()

  return (
    <span>
      {prefixText && <span>{prefixText} </span>}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="film-link"
        style={{
          display: "inline-flex",
          maxWidth: "100%",
          padding: "2px 8px",
          background: "var(--background-dark)",
          border: "1.2px solid var(--border-color)",
          fontFamily: "'Courier New', monospace",
          fontSize: "9px",
          color: "var(--link)",
          textDecoration: "none",
          verticalAlign: "middle",
          overflow: "hidden",
          transition: "all 0.2s ease",
        }}
        title={url}
      >
        {loading ? (
          <span style={{ color: "var(--foreground-subtle)" }}>↗ {domain}</span>
        ) : metadata?.title ? (
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            ↗ {metadata.title}
            <span style={{ color: "var(--foreground-subtle)", marginLeft: "4px", flexShrink: 0 }}>({domain})</span>
          </span>
        ) : (
          <span>↗ {domain}</span>
        )}
      </a>
    </span>
  )
}
