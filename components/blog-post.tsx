import type { BlogPost } from "@/lib/blog-data"
import type { LinkMetadata } from "@/lib/link-metadata"
// Note: fetchLinkMetadata import removed - metadata is now pre-fetched at build time
import { LinkPreview } from "./link-preview"
import { ContentLinkPreview } from "./content-link-preview"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import parse, { Element, type HTMLReactParserOptions } from "html-react-parser"

interface BlogPostProps {
  post: BlogPost
  isFullView?: boolean
  // Pre-fetched metadata map (URL -> LinkMetadata) for SSR performance
  metadataMap?: Map<string, LinkMetadata>
}

// Allowed HTML tags for sanitization (prevents XSS)
const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'u', 'br', 'img', 'a', 'span']
const ALLOWED_ATTR = ['href', 'src', 'alt', 'width', 'height', 'target', 'rel', 'class']

// Simple server-safe HTML sanitizer (avoids jsdom dependency issues)
// Only allows safe inline formatting tags
function sanitizeHtml(html: string): string {
  // Create regex patterns for allowed tags
  const allowedTagPattern = ALLOWED_TAGS.join('|')
  const allowedAttrPattern = ALLOWED_ATTR.join('|')
  
  // Remove all tags except allowed ones
  // First, temporarily mark allowed tags
  let result = html
  
  // Match allowed opening tags with their attributes
  const openTagRegex = new RegExp(`<(${allowedTagPattern})(\\s+(?:${allowedAttrPattern})="[^"]*")*\\s*/?>`, 'gi')
  const closeTagRegex = new RegExp(`</(${allowedTagPattern})>`, 'gi')
  
  // Extract and preserve allowed tags
  const preserved: string[] = []
  result = result.replace(openTagRegex, (match) => {
    preserved.push(match)
    return `\x00${preserved.length - 1}\x00`
  })
  result = result.replace(closeTagRegex, (match) => {
    preserved.push(match)
    return `\x00${preserved.length - 1}\x00`
  })
  
  // Strip all remaining HTML tags
  result = result.replace(/<[^>]*>/g, '')
  
  // Restore preserved tags
  result = result.replace(/\x00(\d+)\x00/g, (_, idx) => preserved[parseInt(idx)])

  return result
}

// Parse inline HTML tags into React elements using html-react-parser
// Sanitized to prevent XSS attacks
const parseInlineFormatting = (text: string): React.ReactNode => {
  // Sanitize HTML to only allow safe tags
  const sanitized = sanitizeHtml(text)

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "img") {
        const { src, alt, width, height } = domNode.attribs
        return (
          <Image
            src={src}
            alt={alt || ""}
            width={width ? parseInt(width) : 600}
            height={height ? parseInt(height) : 400}
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "1em 0",
              borderRadius: "4px",
            }}
          />
        )
      }
    },
  }
  return parse(sanitized, options)
}

// Simple URL regex to detect links
const URL_REGEX = /https?:\/\/[^\s]+/g

// Check if a line is a standalone URL
const isStandaloneUrl = (line: string): boolean => {
  const trimmed = line.trim()
  return /^https?:\/\/[^\s]+$/.test(trimmed)
}

export function BlogPostComponent({ post, isFullView = false, metadataMap }: BlogPostProps) {
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
        prefetchedMetadata={metadataMap?.get(url)}
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
        const trimmedUrl = line.trim()
        blocks.push(
          <ContentLinkPreview
            key={`link-block-${blocks.length}`}
            url={trimmedUrl}
            prefetchedMetadata={metadataMap?.get(trimmedUrl)}
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
    <article style={{ marginBottom: "36px" }}>
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
              paddingLeft: 0, 
              fontSize: "11px", 
              color: "var(--foreground-muted)", 
              fontFamily: "'Courier New', monospace", 
              listStyle: "none",
              lineHeight: 1.8,
            }}
          >
            {post.sources.map((source, i) => (
              <li 
                key={`source-${i}`} 
                style={{ 
                  marginBottom: "4px", 
                  wordBreak: "break-word",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5em",
                }}
              >
                <span style={{ flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ minWidth: 0 }}>{renderSourceItem(source, i)}</span>
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
            marginTop: "36px",
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
