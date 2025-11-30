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
        style={{
          display: "inline-block",
          padding: "2px 6px",
          background: "#f5f5f5",
          border: "1px solid #ddd",
          fontFamily: "monospace",
          fontSize: "9px",
          color: "#555",
          textDecoration: "none",
          verticalAlign: "middle",
        }}
        title={url}
      >
        {loading ? (
          <span style={{ color: "#999" }}>↗ {domain}</span>
        ) : metadata?.title ? (
          <span>
            ↗ {metadata.title.length > 50 ? metadata.title.slice(0, 50) + "…" : metadata.title}
            <span style={{ color: "#999", marginLeft: "4px" }}>({domain})</span>
          </span>
        ) : (
          <span>↗ {domain}</span>
        )}
      </a>
    </span>
  )
}

