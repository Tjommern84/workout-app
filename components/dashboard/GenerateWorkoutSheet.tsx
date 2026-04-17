'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FocusMode, WorkoutRecord } from '@/lib/types'
import { FOCUS_MODE_TEMPLATES, generateSmartWorkout, restTimeForFocusMode, defaultFocusMode } from '@/lib/generator'
import { useWorkout } from '@/context/WorkoutContext'
import { loadProfile } from '@/lib/storage'

interface Props {
  history: WorkoutRecord[]
  availableEquipment?: string[]
  onClose: () => void
}

export default function GenerateWorkoutSheet({ history, onClose }: Props) {
  const profileResult = loadProfile()
  const profile = profileResult.ok && profileResult.data ? profileResult.data : null
  const recommended = profile ? defaultFocusMode(profile.goal) : 'hypertrophy'
  const [selected, setSelected] = useState<FocusMode>(recommended)
  const { startWorkout } = useWorkout()
  const router = useRouter()

  function handleStart() {
    const profile = loadProfile()
    const age = profile.ok && profile.data ? profile.data.age : undefined
    const equipment = profile.ok && profile.data ? profile.data.equipment : undefined
    const workout = generateSmartWorkout(history, selected, equipment, age)
    startWorkout(workout)
    onClose()
    router.push('/workout')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-[#1a1a1a] rounded-t-3xl p-6 pb-10 border-t border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        <h2 className="text-xl font-bold mb-1">Generer trening</h2>
        <p className="text-gray-400 text-sm mb-6">
          Appen velger øvelser basert på hvilke muskler som er minst trent.
        </p>

        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Velg fokus</p>

        <div className="space-y-3 mb-8">
          {(Object.keys(FOCUS_MODE_TEMPLATES) as FocusMode[]).map(mode => {
            const t = FOCUS_MODE_TEMPLATES[mode]
            const isSelected = selected === mode
            return (
              <button
                key={mode}
                onClick={() => setSelected(mode)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-green-500/10 border-green-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{t.label}</p>
                      {mode === recommended && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">Anbefalt</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-gray-400">{t.sets} × {t.repsLabel}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(() => {
                        const profile = loadProfile()
                        const age = profile.ok && profile.data ? profile.data.age : undefined
                        const sec = restTimeForFocusMode(mode, age)
                        const label = sec >= 60
                          ? `${Math.floor(sec / 60)} min pause`
                          : `${sec} sek pause`
                        return label
                      })()}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl text-lg transition-colors"
        >
          Start trening →
        </button>
      </div>
    </div>
  )
}
