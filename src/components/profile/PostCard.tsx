import { Twitter, Heart, Repeat2 } from 'lucide-react'
import VerificationBadge from '@/components/shared/VerificationBadge'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const hashtags: string[] = post.hashtags ? JSON.parse(post.hashtags) : []
  const mentions: string[] = post.mentions ? JSON.parse(post.mentions) : []

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            <Twitter className="h-3 w-3" />
            Twitter
          </span>
          <span className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <VerificationBadge postId={post.id} />
      </div>

      <p className="mb-3 text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>

      {(hashtags.length > 0 || mentions.length > 0) && (
        <div className="mb-3 flex flex-wrap gap-1">
          {hashtags.map((tag) => (
            <span key={tag} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-600">
              #{tag}
            </span>
          ))}
          {mentions.map((mention) => (
            <span key={mention} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              @{mention}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1">
          <Heart className="h-3 w-3" />
          {post.likeCount}
        </span>
        <span className="inline-flex items-center gap-1">
          <Repeat2 className="h-3 w-3" />
          {post.retweetCount}
        </span>
      </div>
    </div>
  )
}
