'use client'

export const dynamic = 'force-dynamic'

export default function DebugPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Debug Page - App is Working!
        </h1>
        <p className="text-gray-600 mb-6">
          If you can see this page, the Next.js app is deployed correctly.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Timestamp: {new Date().toISOString()}
          </p>
          <p className="text-sm text-gray-700">
            Environment: {process.env.NODE_ENV}
          </p>
        </div>
      </div>
    </div>
  )
}