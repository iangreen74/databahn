import Navigation from '@/components/shared/Navigation'
import ArchiveUploader from '@/components/import/ArchiveUploader'

export default function ImportPage() {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Import Your Data</h1>
          <p className="text-gray-500">
            Upload your Twitter/X data archive. Every tweet will be cryptographically
            signed with your identity, proving you are the author.
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-1 text-sm font-medium text-blue-900">How to get your archive</h3>
          <ol className="list-inside list-decimal space-y-1 text-xs text-blue-700">
            <li>Go to Twitter/X Settings &gt; Your Account &gt; Download an archive of your data</li>
            <li>Request your archive and wait for the email</li>
            <li>Download the ZIP file and upload it here</li>
          </ol>
        </div>

        <ArchiveUploader />
      </main>
    </>
  )
}
