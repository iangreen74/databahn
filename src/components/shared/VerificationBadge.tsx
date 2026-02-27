'use client'

import { useState } from 'react'
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react'

interface VerificationBadgeProps {
  postId: string
  initialVerified?: boolean
}

export default function VerificationBadge({ postId, initialVerified }: VerificationBadgeProps) {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>(
    initialVerified === true ? 'valid' : initialVerified === false ? 'invalid' : 'idle'
  )

  async function verify() {
    setStatus('verifying')
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      const data = await res.json()
      setStatus(data.valid ? 'valid' : 'invalid')
    } catch {
      setStatus('invalid')
    }
  }

  if (status === 'verifying') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Verifying
      </span>
    )
  }

  if (status === 'valid') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <ShieldCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    )
  }

  if (status === 'invalid') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-500">
        <ShieldAlert className="h-3.5 w-3.5" />
        Invalid
      </span>
    )
  }

  return (
    <button
      onClick={verify}
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600 transition-colors"
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      Verify
    </button>
  )
}
