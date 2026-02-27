import Link from 'next/link'
import Navigation from '@/components/shared/Navigation'
import { Fingerprint, Shield, ArrowRight, Database, Lock, Globe } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
            Own Your Digital Identity
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-500">
            Your content. Your identity. Your keys. databahn gives you a cryptographic
            identity that no platform can revoke, and signs every piece of content you
            have ever created.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/identity"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <Fingerprint className="h-4 w-4" />
              Create Your Identity
            </Link>
            <Link
              href="/import"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Import Data
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                  <Lock className="h-7 w-7 text-brand-700" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">1. Create Identity</h3>
                <p className="text-sm text-gray-500">
                  Generate a cryptographic keypair — an Ed25519 identity encoded as a
                  W3C Decentralized Identifier (DID). No email. No password. Just math.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                  <Database className="h-7 w-7 text-brand-700" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">2. Import Your Data</h3>
                <p className="text-sm text-gray-500">
                  Upload your Twitter/X archive. Every tweet is parsed, cryptographically
                  signed with your identity, and stored — proving you are the author.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                  <Globe className="h-7 w-7 text-brand-700" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">3. Own Your Profile</h3>
                <p className="text-sm text-gray-500">
                  View your reconstructed profile — all your content, verified and owned
                  by you. No platform can take it away.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="border-t border-gray-200">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <Shield className="mb-3 h-8 w-8 text-brand-600" />
                <h3 className="mb-2 font-semibold text-gray-900">Self-Sovereign</h3>
                <p className="text-sm text-gray-500">
                  Your identity is a cryptographic keypair. You hold the keys.
                  No company controls your account, your content, or your audience.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <Fingerprint className="mb-3 h-8 w-8 text-brand-600" />
                <h3 className="mb-2 font-semibold text-gray-900">Verifiable</h3>
                <p className="text-sm text-gray-500">
                  Every piece of content is signed. Anyone can verify you authored it
                  using your public DID — no trust in a platform required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
