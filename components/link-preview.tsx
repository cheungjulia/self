"use client"

import { useEffect, useState } from "react"
import type { LinkMetadata } from "@/lib/link-metadata"

interface LinkPreviewProps {
  url: string
  prefixText?: string // Text before the URL (e.g., quotes from the source)
  fetchMetadata: (url: string) => Promise<LinkMetadata>
}

export function LinkPreview({ url, prefixText, fetchMetadata }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetadata(url)
      .then(setMetadata)
      .finally(() => setLoading(false))
  }, [url, fetchMetadata])

  const domain = metadata?.domain ?? new URL(url).hostname.replace(/^www\./, "")

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
