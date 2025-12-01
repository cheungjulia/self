import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllPosts } from "@/lib/blog-data"
import Link from "next/link"

export default function ArchivePage() {
  const posts = getAllPosts()

  return (
    <main>
      <SiteHeader />

      <h2
        style={{
          fontFamily: "var(--font-noto-serif-hk), var(--font-playfair), Georgia, serif",
          fontWeight: 400,
          fontSize: "20px",
          margin: "0 0 24px 0",
          color: "var(--foreground)",
          letterSpacing: "0.02em",
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
        {posts.map((post, index) => (
          <li
            key={post.id}
            className="archive-item fade-up"
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <span className="archive-date">
              {post.date}
            </span>
            <Link 
              href={`/post/${post.id}`}
              style={{
                color: "var(--foreground-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  )
}
