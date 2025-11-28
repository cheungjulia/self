import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllPosts } from "@/lib/blog-data"
import Link from "next/link"

export default function ArchivePage() {
  const posts = getAllPosts()

  return (
    <main style={{ maxWidth: "600px", margin: "0 auto" }}>
      <SiteHeader />

      <h2
        style={{
          fontWeight: "normal",
          fontSize: "18px",
          margin: "0 0 20px 0",
        }}
      >
        archive
      </h2>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "12px",
                color: "#666666",
                marginRight: "15px",
              }}
            >
              {post.date}
            </span>
            <Link href={`/post/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  )
}
