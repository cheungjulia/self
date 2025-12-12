"use client"

import { useEffect, useState } from "react"
import type { LinkMetadata } from "@/lib/link-metadata"

interface ContentLinkPreviewProps {
  url: string
  prefetchedMetadata?: LinkMetadata // Pre-fetched metadata from SSR (preferred)
  fetchMetadata?: (url: string) => Promise<LinkMetadata> // Fallback for client-side fetch
}

export function ContentLinkPreview({ url, prefetchedMetadata, fetchMetadata }: ContentLinkPreviewProps) {
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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="content-link-preview"
      style={{
        display: "block",
        margin: "1em 0",
        padding: "12px 0 12px 16px",
        background: "transparent",
        borderLeft: "2px solid var(--border-color)",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
    >
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "10px",
              color: "var(--foreground-subtle)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            ↗ {domain}
          </span>
        </div>
      ) : (
        <>
          {metadata?.title && (
            <div
              style={{
                fontFamily: "var(--font-noto-serif-hk), var(--font-playfair), Georgia, serif",
                fontSize: "14px",
                color: "var(--foreground-muted)",
                marginBottom: metadata?.description ? "8px" : "0",
                lineHeight: 1.4,
              }}
            >
              {metadata.title}
            </div>
          )}
          {metadata?.description && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--foreground-muted)",
                lineHeight: 1.5,
                marginBottom: "10px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {metadata.description}
            </div>
          )}
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "10px",
              color: "var(--foreground-subtle)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            ↗ {domain}
          </div>
        </>
      )}
    </a>
  )
}

