import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogPostComponent } from "@/components/blog-post"
import { getAllPosts } from "@/lib/blog-data"
import { extractUrlsFromPost, prefetchMetadataForUrls } from "@/lib/link-metadata"

export default async function Home() {
  const posts = getAllPosts()

  // Pre-fetch all link metadata at build time for better performance
  const allUrls = posts.flatMap(post => 
    extractUrlsFromPost(post.content, post.sources)
  )
  const metadataMap = await prefetchMetadataForUrls(allUrls)

  return (
    <main>
      <SiteHeader />

      <section>
        {posts.map((post) => (
          <BlogPostComponent key={post.id} post={post} metadataMap={metadataMap} />
        ))}
      </section>

      <SiteFooter />
    </main>
  )
}
