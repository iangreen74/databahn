import { NextResponse } from 'next/server'
import { getIdentityByDid, getPostsByIdentity, getPostCount } from '@/lib/db/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const did = searchParams.get('did')
    const limit = parseInt(searchParams.get('limit') ?? '50', 10)
    const offset = parseInt(searchParams.get('offset') ?? '0', 10)

    if (!did) {
      return NextResponse.json({ error: 'did parameter required' }, { status: 400 })
    }

    const identity = getIdentityByDid(did)
    if (!identity) {
      return NextResponse.json({ error: 'Identity not found' }, { status: 404 })
    }

    const posts = getPostsByIdentity(identity.id, limit, offset)
    const total = getPostCount(identity.id)

    return NextResponse.json({
      posts,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Failed to get posts:', error)
    return NextResponse.json(
      { error: 'Failed to get posts' },
      { status: 500 }
    )
  }
}
