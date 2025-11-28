import type { BlogPost } from "@/lib/blog-data"
import React from "react"
import Link from "next/link"

interface BlogPostProps {
  post: BlogPost
  isFullView?: boolean
}

export function BlogPostComponent({ post, isFullView = false }: BlogPostProps) {
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
            style={{ margin: "0 0 15px 0", maxWidth: "100%", whiteSpace: "pre-wrap" }}
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
          }}
        >
          <Link href={`/post/${post.id}`} style={{ fontStyle: "italic" }}>
            {post.title}
          </Link>
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
    </article>
  )
}
