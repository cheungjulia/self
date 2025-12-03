/**
 * Template for new blog posts
 * 
 * To create a new post:
 * 1. Copy this file to posts/YYYY/MM/DD.ts (e.g., posts/2025/11/28.ts)
 * 2. Fill in title, location, content
 * 3. Add time (recommended) - if omitted, falls back to file mtime (unreliable on Vercel)
 * 4. Run `npm run dev` - id and date are auto-generated from the file path!
 */

import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "",
  time: "",  // e.g. "10:30 AM" - recommended to set explicitly
  location: "",
  content: ``,
  // sources: [
  //   "https://example.com/article",
  //   "Some note or context",
  // ],
}
