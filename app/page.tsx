import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogPostComponent } from "@/components/blog-post"
import { getAllPosts } from "@/lib/blog-data"

export default function Home() {
  const posts = getAllPosts()

  return (
    <main>
      <SiteHeader />

      <section>
        {posts.map((post) => (
          <BlogPostComponent key={post.id} post={post} />
        ))}
      </section>

      <SiteFooter />
    </main>
  )
}
