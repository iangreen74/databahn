export interface Identity {
  id: string
  did: string
  publicKey: string
  privateKey: string | null
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  identityId: string
  originalId: string | null
  sourcePlatform: string
  content: string
  createdAt: string
  importedAt: string
  mediaUrls: string | null
  hashtags: string | null
  mentions: string | null
  replyToId: string | null
  retweetCount: number
  likeCount: number
  signature: string
  contentHash: string
  signedAt: string
}

export interface Connection {
  id: string
  identityId: string
  connectionType: 'follower' | 'following'
  sourcePlatform: string
  sourceUserId: string | null
  sourceUsername: string | null
  importedAt: string
}

export interface ImportLog {
  id: string
  identityId: string
  sourcePlatform: string
  fileName: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  totalItems: number
  importedItems: number
  errorMessage: string | null
  startedAt: string
  completedAt: string | null
}

export interface SignableContent {
  did: string
  content: string
  originalId?: string
  sourcePlatform: string
  createdAt: string
  importedAt: string
}

export interface KeyPair {
  privateKey: Uint8Array
  publicKey: Uint8Array
}

export interface SignatureResult {
  signature: string
  contentHash: string
}
