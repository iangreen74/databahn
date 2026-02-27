'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import PostCard from './PostCard'
import type { Post } from '@/types'

interface PostFeedProps {
  did: string
  initialPosts: Post[]
  totalPosts: number
}

export default function PostFeed({ did, initialPosts, totalPosts }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length < totalPosts)

  async function loadMore() {
    setLoading(true)
    try {
      const res = await fetch(`/api/posts?did=${encodeURIComponent(did)}&offset=${posts.length}&limit=50`)
      const data = await res.json()
      const newPosts = [...posts, ...data.posts]
      setPosts(newPosts)
      setHasMore(newPosts.length < data.total)
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">No posts yet. Import your archive to see your content here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Load more (${totalPosts - posts.length} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  )
}
