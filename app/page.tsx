'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWorkout } from '@/context/WorkoutContext'
import { getLastTrainedDates, FOCUS_MODE_TEMPLATES } from '@/lib/generator'
import { getById } from '@/lib/exercises'
import MuscleGroupGrid from '@/components/dashboard/MuscleGroupGrid'
import GenerateWorkoutSheet from '@/components/dashboard/GenerateWorkoutSheet'
import AdaptiveDashboard from '@/components/adaptive/AdaptiveDashboard'
import PersonalRecords from '@/components/dashboard/PersonalRecords'

export default function DashboardPage() {
  const { state } = useWorkout()
  const [showSheet, setShowSheet] = useState(false)
  const router = useRouter()

  const lastTrained = getLastTrainedDates(state.history)
  const lastWorkout = state.history[0]

  if (!state.hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">WorkoutAI 💪</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
            ⚙️
          </Link>
          <Link href="/history" className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
            Historikk
          </Link>
        </div>
      </div>

      {/* Welcome banner for new users */}
      {state.history.length === 0 && !state.activeWorkout && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
          <p className="font-bold text-green-400 mb-1">Velkommen til WorkoutAI!</p>
          <p className="text-sm text-gray-300">
            Trykk på &quot;Generer smart trening&quot; nedenfor for å lage din første økt.
            Appen velger øvelser basert på utstyret du valgte og hva du sist trente.
          </p>
        </div>
      )}

      {/* Active workout banner */}
      {state.activeWorkout && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-green-400 font-semibold text-sm">Aktiv økt</p>
            <p className="text-white font-bold">{state.activeWorkout.name}</p>
          </div>
          <button
            onClick={() => router.push('/workout')}
            className="bg-green-500 text-black font-bold px-4 py-2 rounded-xl text-sm"
          >
            Fortsett
          </button>
        </div>
      )}

      {/* Last workout */}
      {lastWorkout && (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Siste økt</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{lastWorkout.name}</p>
              <p className="text-gray-400 text-sm">
                {new Date(lastWorkout.date).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'short' })}
                {' · '}{lastWorkout.durationMinutes} min
                {' · '}{FOCUS_MODE_TEMPLATES[lastWorkout.focusMode].label}
              </p>
            </div>
            <Link href={`/history/${lastWorkout.id}`} className="text-xs text-gray-500 hover:text-white transition-colors">
              Se →
            </Link>
          </div>
        </div>
      )}

      {/* Muscle recovery grid */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Restitusjon per muskelgruppe</p>
        <MuscleGroupGrid lastTrained={lastTrained} history={state.history} />
      </div>

      {/* Generate workout CTA */}
      {!state.activeWorkout && (
        <button
          onClick={() => setShowSheet(true)}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl text-lg transition-colors mb-4"
        >
          Generer smart trening ✨
        </button>
      )}

      {/* Adaptive dashboard section */}
      <div className="mb-6">
        <AdaptiveDashboard history={state.history} />
      </div>

      {/* Personal Records */}
      {state.history.length > 0 && (
        <div className="mb-6">
          <PersonalRecords history={state.history} />
        </div>
      )}

      {/* Recent exercises shortcut to progress page */}
      {state.history.length > 0 && (() => {
        const seen = new Set<string>()
        const recentExercises: string[] = []
        for (const rec of state.history) {
          for (const ex of rec.exercises) {
            if (!seen.has(ex.exerciseId)) {
              seen.add(ex.exerciseId)
              recentExercises.push(ex.exerciseId)
            }
          }
          if (recentExercises.length >= 3) break
        }
        if (recentExercises.length === 0) return null
        return (
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Siste øvelser</p>
            <div className="space-y-2">
              {recentExercises.map(id => {
                const ex = getById(id)
                if (!ex) return null
                return (
                  <Link key={id} href={`/progress/${id}`} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between hover:border-white/10 transition-colors">
                    <p className="text-sm font-medium">{ex.name}</p>
                    <span className="text-xs text-gray-500">Fremgang →</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/programs" className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 hover:bg-white/5 transition-colors">
          <p className="text-2xl mb-1">📋</p>
          <p className="font-semibold text-sm">Programmer</p>
          <p className="text-gray-500 text-xs">Push/Pull, Splits m.m.</p>
        </Link>
        <Link href="/guider" className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 hover:bg-white/5 transition-colors">
          <p className="text-2xl mb-1">📚</p>
          <p className="font-semibold text-sm">Guider</p>
          <p className="text-gray-500 text-xs">7 evidensbaserte guider</p>
        </Link>
      </div>

      {/* Recovery legend */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Restitusjonsguide</p>
        <div className="space-y-1.5">
          {[
            { color: 'bg-red-500', label: 'Trent i dag – hvil' },
            { color: 'bg-orange-500', label: '1 dag siden – fortsatt stiv' },
            { color: 'bg-yellow-500', label: '2 dager siden – delvis restituert' },
            { color: 'bg-lime-500', label: '3 dager siden – nesten klar' },
            { color: 'bg-green-500', label: '4+ dager – fullt restituert' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${color} inline-block flex-shrink-0`} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {showSheet && (
        <GenerateWorkoutSheet
          history={state.history}
          onClose={() => setShowSheet(false)}
        />
      )}
    </div>
  )
}
