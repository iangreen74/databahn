import { User } from 'lucide-react'
import CopyButton from '@/components/shared/CopyButton'

interface ProfileHeaderProps {
  did: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  postCount: number
  followerCount: number
  followingCount: number
}

export default function ProfileHeader({
  did,
  displayName,
  bio,
  postCount,
  followerCount,
  followingCount,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
          <User className="h-8 w-8 text-brand-700" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            {displayName || 'Anonymous'}
          </h1>
          {bio && (
            <p className="mt-1 text-sm text-gray-600">{bio}</p>
          )}
          <div className="mt-2 flex items-center gap-1">
            <code className="text-xs text-gray-400 break-all">
              {did}
            </code>
            <CopyButton text={did} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-6 border-t border-gray-100 pt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{postCount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{followerCount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{followingCount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
        <span className="text-xs font-medium text-emerald-700">
          Self-sovereign identity — all content cryptographically signed
        </span>
      </div>
    </div>
  )
}
