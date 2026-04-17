'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserProfile, UserLevel, UserGoal, Equipment } from '@/lib/types'
import { loadProfile, saveProfile, loadHistory, saveHistory, loadSettings, saveSettings } from '@/lib/storage'
import { useWorkout } from '@/context/WorkoutContext'
import { validateImportPayload } from '@/lib/validation'

const LEVEL_INFO: Record<UserLevel, { emoji: string; label: string; desc: string }> = {
  guide: {
    emoji: '🟢',
    label: 'Veiledd meg',
    desc: 'Animerte guider, hvile-timer og enkel tilbakemelding per sett',
  },
  structure: {
    emoji: '🔵',
    label: 'Gi meg struktur',
    desc: 'Siste økt-badge, ukentlig volum og post-workout innsikt',
  },
  data: {
    emoji: '🟣',
    label: 'Full datakontroll',
    desc: 'RPE, e1RM-trender, autoregulering og akutt:kronisk ratio',
  },
}

const GOAL_LABELS: Record<UserGoal, string> = {
  lose_fat: '🔥 Forbrenne fett',
  build_muscle: '💪 Bygge muskler',
  get_stronger: '🏋️ Bli sterkere',
  improve_fitness: '🫀 Bedre kondis',
  general_health: '🌱 Generell helse',
}

const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: '🏋️ Vektstang',
  dumbbell: '🥊 Manualer',
  machine: '⚙️ Maskiner',
  cable: '🔗 Kabelmaskin',
  kettlebell: '🔔 Kettlebell',
  bodyweight: '🤸 Kroppsvekt',
}

export default function SettingsPage() {
  const { state, updateSettings } = useWorkout()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [saved, setSaved] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setProfile(loadProfile().data)
  }, [])

  function setLevel(level: UserLevel) {
    if (!profile) return
    const updated = { ...profile, level }
    setProfile(updated)
    saveProfile(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function toggleUnit() {
    const next = state.settings.weightUnit === 'kg' ? 'lbs' : 'kg'
    updateSettings({ ...state.settings, weightUnit: next })
  }

  function handleExport() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      history: loadHistory().data,
      settings: loadSettings().data,
      profile: loadProfile().data,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workoutai-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        const result = validateImportPayload(data)
        if (!result.valid) {
          setImportError(result.error ?? 'Ugyldig backup-fil.')
          return
        }
        saveHistory(result.history!)
        if (result.settings) saveSettings(result.settings)
        if (result.profile) saveProfile(result.profile)
        setImportSuccess(true)
        setTimeout(() => window.location.reload(), 1200)
      } catch {
        setImportError('Kunne ikke lese filen. Er den en gyldig WorkoutAI-backup?')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
          ←
        </button>
        <h1 className="text-2xl font-bold">Innstillinger</h1>
        {saved && (
          <span className="ml-auto text-green-400 text-sm animate-pulse">Lagret ✓</span>
        )}
      </div>

      {/* User level */}
      <section className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Appnivå</p>
        <div className="space-y-2">
          {(Object.keys(LEVEL_INFO) as UserLevel[]).map((lvl) => {
            const info = LEVEL_INFO[lvl]
            const active = profile?.level === lvl
            return (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  active
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/8 bg-white/3 hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{info.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{info.label}</p>
                      {active && <span className="text-green-400 text-xs">Aktivt</span>}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{info.desc}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Profile summary */}
      {profile && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Profil</p>
            <Link href="/onboarding" className="text-xs text-gray-500 hover:text-white">
              Endre →
            </Link>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">Mål</p>
              <p className="text-sm font-medium">{GOAL_LABELS[profile.goal]}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">Treningsdager</p>
              <p className="text-sm font-medium">{profile.daysPerWeek} dager/uke</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Utstyr</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.equipment.map((e) => (
                  <span
                    key={e}
                    className="text-xs bg-white/8 px-2 py-1 rounded-full text-gray-300"
                  >
                    {EQUIPMENT_LABELS[e]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Weight unit */}
      <section className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Enheter</p>
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={toggleUnit}
            className="w-full flex items-center justify-between p-4"
          >
            <p className="font-medium">Vektenhet</p>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${state.settings.weightUnit === 'kg' ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
                kg
              </span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${
                state.settings.weightUnit === 'lbs' ? 'bg-green-500' : 'bg-gray-600'
              }`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  state.settings.weightUnit === 'lbs' ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </div>
              <span className={`text-sm ${state.settings.weightUnit === 'lbs' ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
                lbs
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Data export / import */}
      <section className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Data</p>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors"
          >
            <div className="text-left">
              <p className="font-medium text-sm">Eksporter data</p>
              <p className="text-xs text-gray-500 mt-0.5">{state.history.length} økter som JSON-backup</p>
            </div>
            <span className="text-gray-400 text-lg">⬇️</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors"
          >
            <div className="text-left">
              <p className="font-medium text-sm">Importer data</p>
              <p className="text-xs text-gray-500 mt-0.5">Gjenopprett fra backup-fil</p>
            </div>
            <span className="text-gray-400 text-lg">⬆️</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />

          {importError && (
            <p className="text-red-400 text-xs px-1">{importError}</p>
          )}
          {importSuccess && (
            <p className="text-green-400 text-xs px-1">Import vellykket! Laster siden på nytt…</p>
          )}
        </div>
      </section>

      {/* Onboarding reset */}
      {!profile?.onboardingComplete && (
        <Link
          href="/onboarding"
          className="block w-full text-center bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 text-sm font-medium transition-colors"
        >
          Fullfør profil-oppsett →
        </Link>
      )}
    </div>
  )
}
