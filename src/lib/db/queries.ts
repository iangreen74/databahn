import { v4 as uuidv4 } from 'uuid'
import { getDb } from './connection'
import type { Identity, Post, Connection, ImportLog } from '@/types'

// --- Identities ---

export function createIdentity(
  did: string,
  publicKey: string,
  privateKey: string | null,
  displayName?: string,
  bio?: string
): Identity {
  const db = getDb()
  const id = uuidv4()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO identities (id, did, public_key, private_key, display_name, bio, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, did, publicKey, privateKey, displayName ?? null, bio ?? null, now, now)

  return getIdentityById(id)!
}

export function getIdentityById(id: string): Identity | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM identities WHERE id = ?').get(id) as Record<string, unknown> | undefined
  return row ? mapIdentity(row) : null
}

export function getIdentityByDid(did: string): Identity | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM identities WHERE did = ?').get(did) as Record<string, unknown> | undefined
  return row ? mapIdentity(row) : null
}

export function getFirstIdentity(): Identity | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM identities ORDER BY created_at ASC LIMIT 1').get() as Record<string, unknown> | undefined
  return row ? mapIdentity(row) : null
}

export function updateIdentityProfile(
  id: string,
  displayName: string | null,
  bio: string | null,
  avatarUrl: string | null
): void {
  const db = getDb()
  db.prepare(`
    UPDATE identities SET display_name = ?, bio = ?, avatar_url = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(displayName, bio, avatarUrl, id)
}

// --- Posts ---

export function insertPost(post: Omit<Post, 'importedAt' | 'signedAt'>): void {
  const db = getDb()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO posts (id, identity_id, original_id, source_platform, content, created_at,
      imported_at, media_urls, hashtags, mentions, reply_to_id, retweet_count, like_count,
      signature, content_hash, signed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    post.id, post.identityId, post.originalId, post.sourcePlatform,
    post.content, post.createdAt, now, post.mediaUrls, post.hashtags,
    post.mentions, post.replyToId, post.retweetCount, post.likeCount,
    post.signature, post.contentHash, now
  )
}

export function getPostsByIdentity(
  identityId: string,
  limit: number = 50,
  offset: number = 0
): Post[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT * FROM posts WHERE identity_id = ?
    ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(identityId, limit, offset) as Record<string, unknown>[]
  return rows.map(mapPost)
}

export function getPostCount(identityId: string): number {
  const db = getDb()
  const row = db.prepare('SELECT COUNT(*) as count FROM posts WHERE identity_id = ?').get(identityId) as { count: number }
  return row.count
}

export function getPostById(id: string): Post | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Record<string, unknown> | undefined
  return row ? mapPost(row) : null
}

// --- Connections ---

export function insertConnection(
  identityId: string,
  connectionType: string,
  sourcePlatform: string,
  sourceUserId: string | null,
  sourceUsername: string | null
): void {
  const db = getDb()
  const id = uuidv4()

  db.prepare(`
    INSERT INTO connections (id, identity_id, connection_type, source_platform, source_user_id, source_username)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, identityId, connectionType, sourcePlatform, sourceUserId, sourceUsername)
}

export function getConnectionCount(identityId: string, connectionType: string): number {
  const db = getDb()
  const row = db.prepare(
    'SELECT COUNT(*) as count FROM connections WHERE identity_id = ? AND connection_type = ?'
  ).get(identityId, connectionType) as { count: number }
  return row.count
}

// --- Import Logs ---

export function createImportLog(identityId: string, sourcePlatform: string, fileName: string | null): string {
  const db = getDb()
  const id = uuidv4()
  db.prepare(`
    INSERT INTO import_logs (id, identity_id, source_platform, file_name, status)
    VALUES (?, ?, ?, ?, 'pending')
  `).run(id, identityId, sourcePlatform, fileName)
  return id
}

export function updateImportLog(
  id: string,
  updates: Partial<Pick<ImportLog, 'status' | 'totalItems' | 'importedItems' | 'errorMessage' | 'completedAt'>>
): void {
  const db = getDb()
  const fields: string[] = []
  const values: unknown[] = []

  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status) }
  if (updates.totalItems !== undefined) { fields.push('total_items = ?'); values.push(updates.totalItems) }
  if (updates.importedItems !== undefined) { fields.push('imported_items = ?'); values.push(updates.importedItems) }
  if (updates.errorMessage !== undefined) { fields.push('error_message = ?'); values.push(updates.errorMessage) }
  if (updates.completedAt !== undefined) { fields.push('completed_at = ?'); values.push(updates.completedAt) }

  if (fields.length === 0) return

  values.push(id)
  db.prepare(`UPDATE import_logs SET ${fields.join(', ')} WHERE id = ?`).run(...values)
}

// --- Mappers ---

function mapIdentity(row: Record<string, unknown>): Identity {
  return {
    id: row.id as string,
    did: row.did as string,
    publicKey: row.public_key as string,
    privateKey: row.private_key as string | null,
    displayName: row.display_name as string | null,
    bio: row.bio as string | null,
    avatarUrl: row.avatar_url as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    identityId: row.identity_id as string,
    originalId: row.original_id as string | null,
    sourcePlatform: row.source_platform as string,
    content: row.content as string,
    createdAt: row.created_at as string,
    importedAt: row.imported_at as string,
    mediaUrls: row.media_urls as string | null,
    hashtags: row.hashtags as string | null,
    mentions: row.mentions as string | null,
    replyToId: row.reply_to_id as string | null,
    retweetCount: row.retweet_count as number,
    likeCount: row.like_count as number,
    signature: row.signature as string,
    contentHash: row.content_hash as string,
    signedAt: row.signed_at as string,
  }
}
