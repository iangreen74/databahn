import { NextResponse } from 'next/server'
import { getFirstIdentity } from '@/lib/db/queries'
import { importTwitterArchive } from '@/lib/archive/importer'

export async function POST(request: Request) {
  try {
    const identity = getFirstIdentity()
    if (!identity) {
      return NextResponse.json(
        { error: 'No identity found. Create an identity first.' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('archive') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No archive file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'Archive must be a ZIP file' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await importTwitterArchive(buffer, identity, file.name)

    return NextResponse.json({
      success: true,
      tweetsImported: result.tweetsImported,
      connectionsImported: result.connectionsImported,
      profileUpdated: result.profileUpdated,
      logId: result.logId,
    })
  } catch (error) {
    console.error('Import failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    )
  }
}
