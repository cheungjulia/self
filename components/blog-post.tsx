import type { BlogPost } from "@/lib/blog-data"
import React from "react"

interface BlogPostProps {
  post: BlogPost
  isFullView?: boolean
}

// Simple URL regex to detect links
const URL_REGEX = /https?:\/\/[^\s]+/g

export function BlogPostComponent({ post, isFullView = false }: BlogPostProps) {
  // Render a source item - auto-link URLs within text
  const renderSourceItem = (source: string, index: number) => {
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match

    URL_REGEX.lastIndex = 0
    while ((match = URL_REGEX.exec(source)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        parts.push(source.slice(lastIndex, match.index))
      }
      // Add the URL as a link
      const url = match[0]
      parts.push(
        <a
          key={`link-${index}-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#666666" }}
        >
          {url}
        </a>
      )
      lastIndex = match.index + url.length
    }
    // Add remaining text after last URL
    if (lastIndex < source.length) {
      parts.push(source.slice(lastIndex))
    }

    return parts.length > 0 ? parts : source
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
            style={{ margin: "0 0 15px 0", maxWidth: "100%", whiteSpace: "pre-wrap", color: "#333333" }}
          >
            {buffer.join("\n")}
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
            style={{
              margin: "0 0 15px 0",
              paddingLeft: "1.5em",
              color: "#333333",
              listStyleType: "disc",
              maxWidth: "100%",
            }}
          >
            {listBuffer.map((item, i) => (
              <li key={`li-${blocks.length}-${i}`}>{item}</li>
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

      // normal text line
      flushList()
      buffer.push(line.replace(/^\s+/, ""))
    }

    // flush remaining
    flushList()
    flushParagraph()

    return blocks
  }

  return (
    <article style={{ marginBottom: "40px" }}>
      {isFullView ? (
        <h2
          style={{
            fontWeight: "normal",
            fontSize: "18px",
            margin: "0 0 10px 0",
            fontStyle: "italic",
            color: "#333333",
          }}
        >
          {post.title}
        </h2>
      ) : (
        <h2
          style={{
            fontWeight: "normal",
            fontSize: "18px",
            margin: "0 0 10px 0",
            fontStyle: "italic",
            color: "#333333"
          }}
        >
          {post.title}
        </h2>
      )}

      <p
        style={{
          fontSize: "12px",
          color: "#666666",
          margin: "0 0 15px 0",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      >
        {post.date} · {post.time}
        <br />
        {post.location}
      </p>

      {renderContent(post.content)}

      {post.sources && post.sources.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "11px", color: "#888888", margin: "0 0 8px 0", fontFamily: "monospace" }}>
            sources and more
          </p>
          <ol style={{ margin: 0, paddingLeft: "1.5em", fontSize: "10px", color: "#666666", fontFamily: "sans-serif", listStyleType: "decimal", listStylePosition: "outside" }}>
            {post.sources.map((source, i) => (
              <li key={`source-${i}`} style={{ marginBottom: "4px", wordBreak: "break-word", paddingLeft: "0.3em" }}>
                {renderSourceItem(source, i)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  )
}
