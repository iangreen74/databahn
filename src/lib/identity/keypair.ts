import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha512'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import type { KeyPair } from '@/types'

// Required: set sha512 for noble/ed25519 v2
ed.etc.sha512Sync = (...m: Uint8Array[]) => sha512(ed.etc.concatBytes(...m))

export async function generateKeypair(): Promise<KeyPair> {
  const privateKey = ed.utils.randomPrivateKey()
  const publicKey = await ed.getPublicKeyAsync(privateKey)
  return { privateKey, publicKey }
}

export function publicKeyToHex(publicKey: Uint8Array): string {
  return bytesToHex(publicKey)
}

export function privateKeyToHex(privateKey: Uint8Array): string {
  return bytesToHex(privateKey)
}

export function hexToPublicKey(hex: string): Uint8Array {
  return hexToBytes(hex)
}

export function hexToPrivateKey(hex: string): Uint8Array {
  return hexToBytes(hex)
}

export function exportKeypairJson(keypair: KeyPair, did: string): string {
  return JSON.stringify({
    did,
    publicKey: publicKeyToHex(keypair.publicKey),
    privateKey: privateKeyToHex(keypair.privateKey),
    algorithm: 'Ed25519',
    exportedAt: new Date().toISOString(),
  }, null, 2)
}
