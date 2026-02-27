import type Database from 'better-sqlite3'

export function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS identities (
      id            TEXT PRIMARY KEY,
      did           TEXT UNIQUE NOT NULL,
      public_key    TEXT NOT NULL,
      private_key   TEXT,
      display_name  TEXT,
      bio           TEXT,
      avatar_url    TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id              TEXT PRIMARY KEY,
      identity_id     TEXT NOT NULL REFERENCES identities(id),
      original_id     TEXT,
      source_platform TEXT DEFAULT 'twitter',
      content         TEXT NOT NULL,
      created_at      TEXT NOT NULL,
      imported_at     TEXT NOT NULL DEFAULT (datetime('now')),
      media_urls      TEXT,
      hashtags        TEXT,
      mentions        TEXT,
      reply_to_id     TEXT,
      retweet_count   INTEGER DEFAULT 0,
      like_count      INTEGER DEFAULT 0,
      signature       TEXT NOT NULL,
      content_hash    TEXT NOT NULL,
      signed_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_posts_identity ON posts(identity_id);
    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_posts_source ON posts(source_platform, original_id);

    CREATE TABLE IF NOT EXISTS connections (
      id              TEXT PRIMARY KEY,
      identity_id     TEXT NOT NULL REFERENCES identities(id),
      connection_type TEXT NOT NULL,
      source_platform TEXT DEFAULT 'twitter',
      source_user_id  TEXT,
      source_username TEXT,
      imported_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_connections_identity ON connections(identity_id);

    CREATE TABLE IF NOT EXISTS import_logs (
      id              TEXT PRIMARY KEY,
      identity_id     TEXT NOT NULL REFERENCES identities(id),
      source_platform TEXT NOT NULL,
      file_name       TEXT,
      status          TEXT NOT NULL DEFAULT 'pending',
      total_items     INTEGER DEFAULT 0,
      imported_items  INTEGER DEFAULT 0,
      error_message   TEXT,
      started_at      TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at    TEXT
    );
  `)
}
