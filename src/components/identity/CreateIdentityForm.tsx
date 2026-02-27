'use client'

import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import IdentityCard from './IdentityCard'

interface IdentityData {
  id: string
  did: string
  publicKey: string
  createdAt: string
}

export default function CreateIdentityForm() {
  const [identity, setIdentity] = useState<IdentityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/identity', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create identity')
        return
      }

      setIdentity(data)
    } catch {
      setError('Failed to create identity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function loadExisting() {
    try {
      const res = await fetch('/api/identity')
      if (res.ok) {
        const data = await res.json()
        setIdentity(data)
      }
    } catch {
      // No existing identity
    }
  }

  // Check for existing identity on mount
  if (!identity && !loading && !error) {
    loadExisting()
  }

  if (identity) {
    return (
      <div className="space-y-4">
        <IdentityCard
          did={identity.did}
          publicKey={identity.publicKey}
          createdAt={identity.createdAt}
        />
        <p className="text-center text-sm text-gray-500">
          Your identity is ready. Next step:{' '}
          <a href="/import" className="font-medium text-brand-600 hover:text-brand-700">
            import your data
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
        <Sparkles className="h-10 w-10 text-brand-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Create Your Identity</h2>
      <p className="mb-8 text-gray-500">
        Generate a cryptographic keypair that becomes your self-sovereign digital identity.
        No email, no password — just math.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating keypair...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Create My Identity
          </>
        )}
      </button>
    </div>
  )
}
