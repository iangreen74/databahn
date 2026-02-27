'use client'

import { Key, Fingerprint } from 'lucide-react'
import CopyButton from '@/components/shared/CopyButton'

interface IdentityCardProps {
  did: string
  publicKey: string
  displayName?: string | null
  createdAt: string
}

export default function IdentityCard({ did, publicKey, displayName, createdAt }: IdentityCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
          <Fingerprint className="h-6 w-6 text-brand-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {displayName || 'Your Identity'}
          </h3>
          <p className="text-xs text-gray-500">
            Created {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Fingerprint className="h-3 w-3" />
            DID (Decentralized Identifier)
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-gray-50 px-3 py-2 text-xs text-gray-700 break-all">
              {did}
            </code>
            <CopyButton text={did} label="Copy DID" />
          </div>
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Key className="h-3 w-3" />
            Public Key
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-gray-50 px-3 py-2 text-xs text-gray-700 break-all">
              {publicKey}
            </code>
            <CopyButton text={publicKey} label="Copy" />
          </div>
        </div>
      </div>
    </div>
  )
}
