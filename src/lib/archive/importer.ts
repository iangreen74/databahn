import { v4 as uuidv4 } from 'uuid'
import { parseTwitterArchive } from './parser'
import { signContent, buildSignableContent } from '@/lib/identity/signing'
import { hexToPrivateKey } from '@/lib/identity/keypair'
import {
  insertPost,
  updateIdentityProfile,
  insertConnection,
  createImportLog,
  updateImportLog,
} from '@/lib/db/queries'
import type { Identity } from '@/types'
import type { TwitterArchiveTweet } from './twitter-types'

export interface ImportResult {
  tweetsImported: number
  connectionsImported: number
  profileUpdated: boolean
  logId: string
}

export async function importTwitterArchive(
  zipBuffer: Buffer,
  identity: Identity,
  fileName: string
): Promise<ImportResult> {
  const logId = createImportLog(identity.id, 'twitter', fileName)

  try {
    updateImportLog(logId, { status: 'processing' })

    const archive = parseTwitterArchive(zipBuffer)
    const totalItems = archive.tweets.length + archive.following.length + archive.followers.length

    updateImportLog(logId, { totalItems })

    // Update profile from archive data
    let profileUpdated = false
    if (archive.account || archive.profile) {
      const displayName = archive.account?.account.accountDisplayName ?? null
      const bio = archive.profile?.profile.description.bio ?? null
      const avatarUrl = archive.profile?.profile.avatarMediaUrl ?? null
      updateIdentityProfile(identity.id, displayName, bio, avatarUrl)
      profileUpdated = true
    }

    // Import tweets with signatures
    if (!identity.privateKey) {
      throw new Error('Private key required to sign imported content')
    }
    const privateKey = hexToPrivateKey(identity.privateKey)
    const now = new Date().toISOString()
    let importedCount = 0

    for (const item of archive.tweets) {
      await importSingleTweet(item, identity, privateKey, now)
      importedCount++
      if (importedCount % 100 === 0) {
        updateImportLog(logId, { importedItems: importedCount })
      }
    }

    // Import connections
    for (const f of archive.following) {
      const username = extractUsername(f.following.userLink)
      insertConnection(identity.id, 'following', 'twitter', f.following.accountId, username)
    }
    for (const f of archive.followers) {
      const username = extractUsername(f.follower.userLink)
      insertConnection(identity.id, 'follower', 'twitter', f.follower.accountId, username)
    }

    const connectionsImported = archive.following.length + archive.followers.length

    updateImportLog(logId, {
      status: 'completed',
      importedItems: importedCount + connectionsImported,
      completedAt: new Date().toISOString(),
    })

    return {
      tweetsImported: importedCount,
      connectionsImported,
      profileUpdated,
      logId,
    }
  } catch (error) {
    updateImportLog(logId, {
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      completedAt: new Date().toISOString(),
    })
    throw error
  }
}

async function importSingleTweet(
  item: TwitterArchiveTweet,
  identity: Identity,
  privateKey: Uint8Array,
  importedAt: string
): Promise<void> {
  const tweet = item.tweet
  const id = uuidv4()

  const signable = buildSignableContent(
    identity.did,
    tweet.full_text,
    'twitter',
    tweet.created_at,
    importedAt,
    tweet.id_str
  )

  const { signature, contentHash } = await signContent(signable, privateKey)

  insertPost({
    id,
    identityId: identity.id,
    originalId: tweet.id_str,
    sourcePlatform: 'twitter',
    content: tweet.full_text,
    createdAt: tweet.created_at,
    mediaUrls: tweet.entities.media
      ? JSON.stringify(tweet.entities.media.map(m => m.media_url_https))
      : null,
    hashtags: tweet.entities.hashtags.length > 0
      ? JSON.stringify(tweet.entities.hashtags.map(h => h.text))
      : null,
    mentions: tweet.entities.user_mentions.length > 0
      ? JSON.stringify(tweet.entities.user_mentions.map(m => m.screen_name))
      : null,
    replyToId: tweet.in_reply_to_status_id_str ?? null,
    retweetCount: parseInt(tweet.retweet_count, 10) || 0,
    likeCount: parseInt(tweet.favorite_count, 10) || 0,
    signature,
    contentHash,
  })
}

function extractUsername(userLink: string): string | null {
  // userLink format: "https://twitter.com/username"
  try {
    const parts = userLink.split('/')
    return parts[parts.length - 1] || null
  } catch {
    return null
  }
}
