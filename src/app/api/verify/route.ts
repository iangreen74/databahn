import { NextResponse } from 'next/server'
import { getPostById, getIdentityById } from '@/lib/db/queries'
import { verifySignature } from '@/lib/identity/signing'
import { hexToPublicKey } from '@/lib/identity/keypair'

export async function POST(request: Request) {
  try {
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'postId required' }, { status: 400 })
    }

    const post = getPostById(postId)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const identity = getIdentityById(post.identityId)
    if (!identity) {
      return NextResponse.json({ error: 'Identity not found' }, { status: 404 })
    }

    const publicKey = hexToPublicKey(identity.publicKey)
    const valid = await verifySignature(post.contentHash, post.signature, publicKey)

    return NextResponse.json({
      valid,
      postId: post.id,
      did: identity.did,
      contentHash: post.contentHash,
      signature: post.signature,
    })
  } catch (error) {
    console.error('Verification failed:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
