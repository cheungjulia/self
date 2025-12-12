import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogPostComponent } from "@/components/blog-post"
import { getPostById, getAllPosts } from "@/lib/blog-data"
import { extractUrlsFromPost, prefetchMetadataForUrls } from "@/lib/link-metadata"
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

  // Pre-fetch link metadata at build time for this post (including followups)
  const followupSources = post.followups?.flatMap(f => f.sources ?? []) ?? []
  const followupContent = post.followups?.map(f => f.content).join('\n') ?? ''
  const allUrls = extractUrlsFromPost(
    post.content + '\n' + followupContent, 
    [...(post.sources ?? []), ...followupSources]
  )
  const metadataMap = await prefetchMetadataForUrls(allUrls)

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

      <BlogPostComponent post={post} isFullView metadataMap={metadataMap} />

      <SiteFooter />
    </main>
  )
}
