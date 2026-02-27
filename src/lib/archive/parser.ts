import AdmZip from 'adm-zip'
import type { ParsedArchive, TwitterArchiveTweet, TwitterArchiveProfile, TwitterArchiveAccount, TwitterArchiveFollowing, TwitterArchiveFollower } from './twitter-types'

function parseJsWrappedJson<T>(jsContent: string): T {
  // Twitter archives wrap JSON in a JS assignment like:
  // window.YTD.tweets.part0 = [...]
  const jsonStart = jsContent.indexOf('[')
  if (jsonStart === -1) {
    // Some files use object format
    const objStart = jsContent.indexOf('{')
    if (objStart === -1) throw new Error('Could not find JSON data in archive file')
    return JSON.parse(jsContent.slice(objStart))
  }
  return JSON.parse(jsContent.slice(jsonStart))
}

function tryReadEntry<T>(zip: AdmZip, entryPath: string): T | null {
  const entry = zip.getEntry(entryPath)
  if (!entry) return null
  try {
    return parseJsWrappedJson<T>(entry.getData().toString('utf8'))
  } catch {
    return null
  }
}

export function parseTwitterArchive(zipBuffer: Buffer): ParsedArchive {
  const zip = new AdmZip(zipBuffer)

  const tweets = tryReadEntry<TwitterArchiveTweet[]>(zip, 'data/tweets.js') ?? []
  const profileArray = tryReadEntry<TwitterArchiveProfile[]>(zip, 'data/profile.js')
  const accountArray = tryReadEntry<TwitterArchiveAccount[]>(zip, 'data/account.js')
  const following = tryReadEntry<TwitterArchiveFollowing[]>(zip, 'data/following.js') ?? []
  const followers = tryReadEntry<TwitterArchiveFollower[]>(zip, 'data/follower.js') ?? []

  return {
    tweets,
    profile: profileArray?.[0] ?? null,
    account: accountArray?.[0] ?? null,
    following,
    followers,
  }
}
