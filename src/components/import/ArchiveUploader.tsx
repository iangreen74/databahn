'use client'

import { useState, useCallback } from 'react'
import { Upload, FileArchive, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface ImportResult {
  tweetsImported: number
  connectionsImported: number
  profileUpdated: boolean
}

export default function ArchiveUploader() {
  const [dragActive, setDragActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file')
      setStatus('error')
      return
    }

    setFileName(file.name)
    setStatus('uploading')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('archive', file)

      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
      setStatus('error')
    }
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  if (status === 'success' && result) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Import Complete</h3>
        <div className="mb-6 space-y-1 text-sm text-gray-600">
          <p>{result.tweetsImported.toLocaleString()} tweets imported and signed</p>
          <p>{result.connectionsImported.toLocaleString()} connections imported</p>
          {result.profileUpdated && <p>Profile updated from archive</p>}
        </div>
        <a
          href="/api/identity"
          onClick={async (e) => {
            e.preventDefault()
            const res = await fetch('/api/identity')
            const data = await res.json()
            if (data.did) {
              window.location.href = `/profile/${encodeURIComponent(data.did)}`
            }
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          View Your Profile
        </a>
      </div>
    )
  }

  if (status === 'uploading') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-brand-600" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Importing {fileName}</h3>
        <p className="text-sm text-gray-500">
          Parsing archive, signing content, and storing your data...
        </p>
      </div>
    )
  }

  return (
    <div>
      {status === 'error' && error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <label
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-12 transition-colors ${
          dragActive
            ? 'border-brand-400 bg-brand-50'
            : 'border-gray-300 bg-white hover:border-brand-300 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          accept=".zip"
          onChange={handleChange}
          className="hidden"
        />
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          {dragActive ? (
            <FileArchive className="h-8 w-8 text-brand-600" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <p className="mb-1 text-sm font-medium text-gray-900">
          Drop your Twitter/X archive here
        </p>
        <p className="text-xs text-gray-500">
          or click to browse. Accepts .zip files from Twitter&apos;s data export.
        </p>
      </label>
    </div>
  )
}
