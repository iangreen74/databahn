import { notFound } from 'next/navigation'
import Navigation from '@/components/shared/Navigation'
import ProfileHeader from '@/components/profile/ProfileHeader'
import PostFeed from '@/components/profile/PostFeed'
import { getIdentityByDid, getPostsByIdentity, getPostCount, getConnectionCount } from '@/lib/db/queries'

interface ProfilePageProps {
  params: { did: string }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const did = decodeURIComponent(params.did)
  const identity = getIdentityByDid(did)

  if (!identity) {
    notFound()
  }

  const posts = getPostsByIdentity(identity.id, 50, 0)
  const postCount = getPostCount(identity.id)
  const followerCount = getConnectionCount(identity.id, 'follower')
  const followingCount = getConnectionCount(identity.id, 'following')

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <ProfileHeader
          did={identity.did}
          displayName={identity.displayName}
          bio={identity.bio}
          avatarUrl={identity.avatarUrl}
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
        />

        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Posts
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({postCount.toLocaleString()} total)
            </span>
          </h2>
          <PostFeed
            did={identity.did}
            initialPosts={posts}
            totalPosts={postCount}
          />
        </div>
      </main>
    </>
  )
}
