"use client"

import { useEffect, useState } from "react"
import type { LinkMetadata } from "@/lib/link-metadata"

interface ContentLinkPreviewProps {
  url: string
  fetchMetadata: (url: string) => Promise<LinkMetadata>
}

export function ContentLinkPreview({ url, fetchMetadata }: ContentLinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetadata(url)
      .then(setMetadata)
      .finally(() => setLoading(false))
  }, [url, fetchMetadata])

  const domain = metadata?.domain ?? new URL(url).hostname.replace(/^www\./, "")

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

