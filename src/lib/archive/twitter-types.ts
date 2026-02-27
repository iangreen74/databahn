export interface TwitterArchiveTweet {
  tweet: {
    id_str: string
    full_text: string
    created_at: string
    favorite_count: string
    retweet_count: string
    in_reply_to_status_id_str?: string
    entities: {
      hashtags: Array<{ text: string }>
      user_mentions: Array<{ screen_name: string }>
      urls: Array<{ expanded_url: string }>
      media?: Array<{ media_url_https: string }>
    }
  }
}

export interface TwitterArchiveProfile {
  profile: {
    description: {
      bio: string
      website: string
      location: string
    }
    avatarMediaUrl: string
  }
}

export interface TwitterArchiveAccount {
  account: {
    accountId: string
    username: string
    accountDisplayName: string
    createdAt: string
  }
}

export interface TwitterArchiveFollowing {
  following: {
    accountId: string
    userLink: string
  }
}

export interface TwitterArchiveFollower {
  follower: {
    accountId: string
    userLink: string
  }
}

export interface ParsedArchive {
  tweets: TwitterArchiveTweet[]
  profile: TwitterArchiveProfile | null
  account: TwitterArchiveAccount | null
  following: TwitterArchiveFollowing[]
  followers: TwitterArchiveFollower[]
}
