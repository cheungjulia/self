import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogPostComponent } from "@/components/blog-post"
import { getPostById, getAllPosts } from "@/lib/blog-data"
import Link from "next/link"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <main>
      <SiteHeader />

      <p 
        className="fade-up"
        style={{ 
          fontSize: "12px", 
          marginBottom: "32px",
        }}
      >
        <Link 
          href="/"
          style={{
            color: "var(--foreground-subtle)",
            textDecoration: "none",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.05em",
            transition: "color 0.2s ease",
          }}
        >
          ← back to all posts
        </Link>
      </p>

      <BlogPostComponent post={post} isFullView />

      <SiteFooter />
    </main>
  )
}
