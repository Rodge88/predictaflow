import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Loading PredictaFlow
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we prepare your dashboard...
        </p>
      </div>
    </div>
  )
}