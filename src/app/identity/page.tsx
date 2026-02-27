import Navigation from '@/components/shared/Navigation'
import CreateIdentityForm from '@/components/identity/CreateIdentityForm'

export default function IdentityPage() {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <CreateIdentityForm />
      </main>
    </>
  )
}
