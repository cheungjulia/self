import type { BlogPost } from "@/lib/blog-data"
import { fetchLinkMetadata } from "@/lib/link-metadata"
import { LinkPreview } from "./link-preview"
import { ContentLinkPreview } from "./content-link-preview"
import Link from "next/link"
import React from "react"

interface BlogPostProps {
  post: BlogPost
  isFullView?: boolean
}

// Parse inline <b> and <i> tags into React elements
const parseInlineFormatting = (text: string): React.ReactNode => {
  const regex = /<(b|i)>(.*?)<\/\1>/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const [, tag, content] = match
    const key = `${tag}-${match.index}`
    parts.push(
      tag === "b" 
        ? <strong key={key}>{parseInlineFormatting(content)}</strong>
        : <em key={key}>{parseInlineFormatting(content)}</em>
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 ? parts[0] : parts
}

// Simple URL regex to detect links
const URL_REGEX = /https?:\/\/[^\s]+/g

// Check if a line is a standalone URL
const isStandaloneUrl = (line: string): boolean => {
  const trimmed = line.trim()
  return /^https?:\/\/[^\s]+$/.test(trimmed)
}

export function BlogPostComponent({ post, isFullView = false }: BlogPostProps) {
  // Render a source item with link preview
  const renderSourceItem = (source: string, index: number) => {
    URL_REGEX.lastIndex = 0
    const match = URL_REGEX.exec(source)

    if (!match) {
      // No URL found, return plain text
      return source
    }

    const url = match[0]
    const prefixText = match.index > 0 ? source.slice(0, match.index).trim() : undefined

    return (
      <LinkPreview
        key={`link-${index}`}
        url={url}
        prefixText={prefixText}
        fetchMetadata={fetchLinkMetadata}
      />
    )
  }

  // Convert content string into blocks: paragraphs and bullet lists
  const renderContent = (content: string) => {
    const lines = content.split(/\r?\n/)

    const blocks: React.ReactElement[] = []
    let buffer: string[] = []
    let listBuffer: string[] = []

    const flushParagraph = () => {
      if (buffer.length) {
        blocks.push(
          <p
            key={`p-${blocks.length}`}
            className="fade-up"
            style={{ 
              margin: "0 0 1.2em 0", 
              maxWidth: "100%", 
              whiteSpace: "pre-wrap", 
              color: "var(--foreground-muted)",
              lineHeight: 1.7,
            }}
          >
            {parseInlineFormatting(buffer.join("\n"))}
          </p>
        )
        buffer = []
      }
    }

    const flushList = () => {
      if (listBuffer.length) {
        blocks.push(
          <ul
            key={`ul-${blocks.length}`}
            className="fade-up"
            style={{
              margin: "0 0 1.2em 0",
              paddingLeft: "1.5em",
              color: "var(--foreground-muted)",
              listStyleType: "disc",
              maxWidth: "100%",
              lineHeight: 1.85,
            }}
          >
            {listBuffer.map((item, i) => (
              <li key={`li-${blocks.length}-${i}`} style={{ marginBottom: "0.3em" }}>{parseInlineFormatting(item)}</li>
            ))}
          </ul>
        )
        listBuffer = []
      }
    }

    for (const raw of lines) {
      const line = raw.replace(/\t/g, "    ")
      const isBlank = line.trim() === ""
      const bulletMatch = line.match(/^\s*-\s+(.*)$/)

      if (bulletMatch) {
        // entering or continuing a list
        flushParagraph()
        listBuffer.push(bulletMatch[1])
        continue
      }

      if (isBlank) {
        // blank line: separate blocks
        flushList()
        flushParagraph()
        continue
      }

      // Check if line is a standalone URL
      if (isStandaloneUrl(line)) {
        flushList()
        flushParagraph()
        blocks.push(
          <ContentLinkPreview
            key={`link-block-${blocks.length}`}
            url={line.trim()}
            fetchMetadata={fetchLinkMetadata}
          />
        )
        continue
      }

      // normal text line
      flushList()
      buffer.push(line.replace(/^\s+/, ""))
    }

    // flush remaining
    flushList()
    flushParagraph()

    return blocks
  }

  const followupCount = post.followups?.length || 0

  const titleContent = (
    <span style={{ 
      textDecoration: "none",
      backgroundImage: "linear-gradient(var(--foreground), var(--foreground))",
      backgroundSize: "0% 1px",
      backgroundPosition: "0 100%",
      backgroundRepeat: "no-repeat",
      transition: "background-size 0.3s ease",
    }}>
      {post.title}
    </span>
  )

  return (
    <article style={{ marginBottom: "48px" }}>
      <div 
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          margin: "0 0 12px 0",
        }}
      >
        <h2
          className="post-title"
          style={{
            fontFamily: "var(--font-noto-serif-hk), var(--font-playfair), Georgia, serif",
            fontWeight: 400,
            fontSize: "20px",
            margin: 0,
            letterSpacing: "0.02em",
            color: "var(--foreground)",
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {isFullView ? (
            post.title
          ) : (
            <Link 
              href={`/post/${post.id}`}
              className="post-title-link"
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {titleContent}
            </Link>
          )}
        </h2>

        {followupCount > 0 && !isFullView && (
          <span
            style={{
              fontSize: "9px",
              fontFamily: "'Courier New', monospace",
              color: "var(--foreground-subtle)",
              padding: "3px 8px",
              border: "1px dashed var(--border-color)",
              whiteSpace: "nowrap",
              letterSpacing: "0.05em",
              marginTop: "4px",
            }}
          >
            +{followupCount} follow-up{followupCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <p
        className="post-meta"
        style={{
          fontSize: "11px",
          color: "var(--foreground-subtle)",
          margin: "0 0 20px 0",
          fontFamily: "'Courier New', Courier, monospace",
          letterSpacing: "0.05em",
        }}
      >
        {post.date} · {post.time}
        <br />
        <span style={{ opacity: 0.8 }}>{post.location}</span>
      </p>

      <div className="post-content">
        {renderContent(post.content)}
      </div>

      {post.sources && post.sources.length > 0 && (
        <div className="sources-section">
          <p className="sources-label">
            sources & more
          </p>
          <ol 
            style={{ 
              margin: 0, 
              paddingLeft: "1.5em", 
              fontSize: "11px", 
              color: "var(--foreground-muted)", 
              fontFamily: "'Courier New', monospace", 
              listStyleType: "decimal", 
              listStylePosition: "outside",
              lineHeight: 1.8,
            }}
          >
            {post.sources.map((source, i) => (
              <li 
                key={`source-${i}`} 
                style={{ 
                  marginBottom: "6px", 
                  wordBreak: "break-word", 
                  paddingLeft: "0.3em" 
                }}
              >
                {renderSourceItem(source, i)}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Follow-ups only shown on individual post page */}
      {isFullView && post.followups && post.followups.length > 0 && (
        <div 
          className="followups-section"
          style={{
            marginTop: "40px",
            paddingTop: "32px",
            borderTop: "1px dashed var(--border-color)",
          }}
        >
          <p 
            style={{
              fontSize: "11px",
              color: "var(--foreground-subtle)",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.1em",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            follow-up thoughts
          </p>
          
          {post.followups.map((followup, index) => (
            <div 
              key={`followup-${index}`}
              className="followup-item fade-up"
              style={{
                marginBottom: "32px",
                paddingLeft: "16px",
                borderLeft: "2px solid var(--border-color)",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  color: "var(--foreground-subtle)",
                  margin: "0 0 12px 0",
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {followup.date}{followup.time && ` · ${followup.time}`}
              </p>
              
              <div className="followup-content">
                {renderContent(followup.content)}
              </div>

              {followup.sources && followup.sources.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <ol 
                    style={{ 
                      margin: 0, 
                      paddingLeft: "1.5em", 
                      fontSize: "10px", 
                      color: "var(--foreground-muted)", 
                      fontFamily: "'Courier New', monospace", 
                      listStyleType: "decimal", 
                      listStylePosition: "outside",
                      lineHeight: 1.7,
                    }}
                  >
                    {followup.sources.map((source, i) => (
                      <li 
                        key={`followup-${index}-source-${i}`} 
                        style={{ 
                          marginBottom: "4px", 
                          wordBreak: "break-word", 
                          paddingLeft: "0.3em" 
                        }}
                      >
                        {renderSourceItem(source, i)}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
