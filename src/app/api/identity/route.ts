import { NextResponse } from 'next/server'
import { generateKeypair, publicKeyToHex, privateKeyToHex } from '@/lib/identity/keypair'
import { publicKeyToDid } from '@/lib/identity/did'
import { createIdentity, getFirstIdentity, getIdentityByDid } from '@/lib/db/queries'

export async function POST() {
  try {
    // Check if identity already exists (prototype: single user)
    const existing = getFirstIdentity()
    if (existing) {
      return NextResponse.json(
        { error: 'Identity already exists. Only one identity per prototype instance.' },
        { status: 409 }
      )
    }

    const keypair = await generateKeypair()
    const did = publicKeyToDid(keypair.publicKey)
    const publicKeyHex = publicKeyToHex(keypair.publicKey)
    const privateKeyHex = privateKeyToHex(keypair.privateKey)

    const identity = createIdentity(did, publicKeyHex, privateKeyHex)

    return NextResponse.json({
      id: identity.id,
      did: identity.did,
      publicKey: identity.publicKey,
      createdAt: identity.createdAt,
    })
  } catch (error) {
    console.error('Failed to create identity:', error)
    return NextResponse.json(
      { error: 'Failed to create identity' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const did = searchParams.get('did')

    const identity = did ? getIdentityByDid(did) : getFirstIdentity()

    if (!identity) {
      return NextResponse.json({ error: 'No identity found' }, { status: 404 })
    }

    return NextResponse.json({
      id: identity.id,
      did: identity.did,
      publicKey: identity.publicKey,
      displayName: identity.displayName,
      bio: identity.bio,
      avatarUrl: identity.avatarUrl,
      createdAt: identity.createdAt,
    })
  } catch (error) {
    console.error('Failed to get identity:', error)
    return NextResponse.json(
      { error: 'Failed to get identity' },
      { status: 500 }
    )
  }
}
