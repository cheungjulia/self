export interface BlogPost {
  id: string
  title: string
  date: string
  time?: string
  location: string
  content: string
}

// Raw post type - what you write in post files (id and date are auto-generated)
export interface RawPost {
  title: string
  location: string
  content: string
  time?: string
}

import { posts } from "@/posts"

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostById(id: string): BlogPost | undefined {
  return posts.find((post) => post.id === id)
}
