import { base58 } from '@scure/base'

// Multicodec prefix for Ed25519 public key
const ED25519_MULTICODEC_PREFIX = new Uint8Array([0xed, 0x01])

export function publicKeyToDid(publicKey: Uint8Array): string {
  const multicodecKey = new Uint8Array(
    ED25519_MULTICODEC_PREFIX.length + publicKey.length
  )
  multicodecKey.set(ED25519_MULTICODEC_PREFIX)
  multicodecKey.set(publicKey, ED25519_MULTICODEC_PREFIX.length)

  const encoded = base58.encode(multicodecKey)
  return `did:key:z${encoded}`
}

export function didToPublicKey(did: string): Uint8Array {
  if (!did.startsWith('did:key:z')) {
    throw new Error('Invalid did:key format. Expected "did:key:z..."')
  }

  const encoded = did.slice('did:key:z'.length)
  const decoded = base58.decode(encoded)

  // Verify the multicodec prefix
  if (decoded[0] !== 0xed || decoded[1] !== 0x01) {
    throw new Error('Invalid multicodec prefix. Expected Ed25519 (0xed01)')
  }

  return decoded.slice(2)
}

export function isValidDid(did: string): boolean {
  try {
    didToPublicKey(did)
    return true
  } catch {
    return false
  }
}

export function shortenDid(did: string): string {
  if (did.length <= 24) return did
  return `${did.slice(0, 16)}...${did.slice(-8)}`
}
