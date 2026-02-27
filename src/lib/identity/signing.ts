import * as ed from '@noble/ed25519'
import { sha256 } from '@noble/hashes/sha256'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import type { SignableContent, SignatureResult } from '@/types'

export function canonicalize(obj: SignableContent): string {
  return JSON.stringify(obj, Object.keys(obj).sort())
}

export function hashContent(canonical: string): Uint8Array {
  return sha256(new TextEncoder().encode(canonical))
}

export async function signContent(
  content: SignableContent,
  privateKey: Uint8Array
): Promise<SignatureResult> {
  const canonical = canonicalize(content)
  const hash = hashContent(canonical)
  const signature = await ed.signAsync(hash, privateKey)
  return {
    signature: bytesToHex(signature),
    contentHash: bytesToHex(hash),
  }
}

export async function verifySignature(
  contentHash: string,
  signature: string,
  publicKey: Uint8Array
): Promise<boolean> {
  try {
    return await ed.verifyAsync(
      hexToBytes(signature),
      hexToBytes(contentHash),
      publicKey
    )
  } catch {
    return false
  }
}

export function buildSignableContent(
  did: string,
  content: string,
  sourcePlatform: string,
  createdAt: string,
  importedAt: string,
  originalId?: string
): SignableContent {
  const signable: SignableContent = {
    did,
    content,
    sourcePlatform,
    createdAt,
    importedAt,
  }
  if (originalId) {
    signable.originalId = originalId
  }
  return signable
}
