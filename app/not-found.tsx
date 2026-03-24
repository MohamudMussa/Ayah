import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold mb-4 text-white/20">404</h1>
      <p className="text-lg text-white/50 mb-8">This ayah could not be found.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
