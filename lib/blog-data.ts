import { posts } from "@/posts"

export interface FollowUp {
  date: string       // e.g., "December 5, 2025"
  time?: string      // e.g., "3:30 PM"
  content: string
  sources?: string[]
}

// Base post fields shared between RawPost and BlogPost
interface BasePost {
  title: string
  location: string
  content: string
  time?: string
  sources?: string[]  // array of URLs or free text - URLs are auto-linked
  followups?: FollowUp[]  // follow-up thoughts - only shown on individual post page
}

// Raw post type - what you write in post files (id and date are auto-generated)
export interface RawPost extends BasePost {}

// Full blog post with generated id and date
export interface BlogPost extends BasePost {
  id: string
  date: string
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostById(id: string): BlogPost | undefined {
  return posts.find((post) => post.id === id)
}
