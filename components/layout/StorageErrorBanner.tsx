'use client'

import { useState } from 'react'
import { useWorkout } from '@/context/WorkoutContext'

export default function StorageErrorBanner() {
  const { state } = useWorkout()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || state.storageErrors.length === 0) return null

  const fields = state.storageErrors.join(', ')

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md px-4 py-3 rounded-2xl text-sm shadow-lg flex items-start gap-3 bg-red-900/80 border border-red-500/40 text-red-200 backdrop-blur-sm">
      <span className="text-base shrink-0">⚠️</span>
      <p className="flex-1 leading-snug">
        Kunne ikke lese lagrede data ({fields}). Data fra denne økten vil bli bevart, men gammel historikk kan mangle.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-red-400 hover:text-red-200 transition-colors text-lg leading-none"
        aria-label="Lukk"
      >
        ×
      </button>
    </div>
  )
}
