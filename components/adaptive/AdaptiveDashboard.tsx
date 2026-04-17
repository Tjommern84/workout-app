'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserLevel, UserProfile, WorkoutRecord } from '@/lib/types'
import { loadProfile } from '@/lib/storage'
import WeeklyVolumeBar from '@/components/level2/WeeklyVolumeBar'
import ConsistencyGrid from '@/components/dashboard/ConsistencyGrid'
import AutoregulationAlert from '@/components/level3/AutoregulationAlert'
import { acuteChronicRatio, acwrDaysRemaining } from '@/lib/analytics'

interface AdaptiveDashboardProps {
  history: WorkoutRecord[]
}

export default function AdaptiveDashboard({ history }: AdaptiveDashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProfile(loadProfile().data)
  }, [])

  const level: UserLevel = profile?.level ?? 'structure'

  if (level === 'guide') {
    return <GuideDashboardSection profile={profile} history={history} />
  }

  if (level === 'structure') {
    return (
      <div className="space-y-4">
        <WeeklyVolumeBar history={history} profile={profile} />
        {history.length > 0 && (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4">
            <ConsistencyGrid history={history} />
          </div>
        )}
      </div>
    )
  }

  // data mode
  return (
    <div className="space-y-4">
      <WeeklyVolumeBar history={history} profile={profile} />
      {history.length > 0 && (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4">
          <ConsistencyGrid history={history} />
        </div>
      )}
      <AutoregulationAlert history={history} />
      <ACRWidget history={history} />
    </div>
  )
}

function GuideDashboardSection({
  profile,
  history,
}: {
  profile: UserProfile | null
  history: WorkoutRecord[]
}) {
  const goal = profile?.goal ?? 'general_health'

  const TIP_MAP: Record<string, { emoji: string; tip: string }> = {
    lose_fat: {
      emoji: '🔥',
      tip: 'Tips: Kombiner styrketrening med 20–30 min HIIT for best fettforbrenning.',
    },
    build_muscle: {
      emoji: '💪',
      tip: 'Tips: Spis nok protein (1,6–2,2g/kg kroppsvekt) for muskelvekst.',
    },
    get_stronger: {
      emoji: '🏋️',
      tip: 'Tips: Tunge løft (3–6 reps, 3–5 sett) gir best styrkeøkning.',
    },
    improve_fitness: {
      emoji: '🫀',
      tip: 'Tips: 2–3 kondisøkter/uke + 2 styrkeøkter gir solid grunnkondis.',
    },
    general_health: {
      emoji: '🌱',
      tip: 'Tips: 150 min moderat aktivitet/uke anbefales av WHO for grunnhelse.',
    },
  }

  const { emoji, tip } = TIP_MAP[goal]

  return (
    <div className="bg-blue-500/8 border border-blue-500/20 rounded-2xl p-4">
      <p className="text-lg mb-1">{emoji}</p>
      <p className="text-blue-300 text-sm leading-relaxed">{tip}</p>
      <Link href="/guider" className="text-xs text-blue-400 mt-2 block hover:underline">
        Se treningsguidene →
      </Link>
    </div>
  )
}

function ACRWidget({ history }: { history: WorkoutRecord[] }) {
  const ratio = acuteChronicRatio(history)
  const daysLeft = acwrDaysRemaining(history)

  if (ratio === null) {
    const pct = daysLeft !== null ? Math.round(((21 - daysLeft) / 21) * 100) : 100
    return (
      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Akutt:Kronisk ratio</p>
        {daysLeft !== null ? (
          <>
            <p className="text-sm text-gray-400 mb-2">Tilgjengelig om {daysLeft} dag{daysLeft !== 1 ? 'er' : ''}</p>
            <div className="h-1.5 bg-white/10 rounded-full">
              <div className="h-full bg-green-500/50 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-600 mt-1.5">Fortsett å trene – 21 dager med data trengs</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Ikke nok data ennå.</p>
        )}
      </div>
    )
  }

  const color =
    ratio > 1.5 ? 'text-red-400' :
    ratio > 1.3 ? 'text-orange-400' :
    ratio < 0.8 ? 'text-blue-400' :
    'text-green-400'

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Akutt:Kronisk ratio</p>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold tabular-nums ${color}`}>{ratio.toFixed(2)}</span>
        <span className="text-gray-500 text-sm mb-1">
          {ratio > 1.5 ? '⚠️ For høy' :
           ratio > 1.3 ? 'Litt høy' :
           ratio < 0.8 ? 'Lav – restitusjonsuke?' :
           '✓ Optimal (0.8–1.3)'}
        </span>
      </div>
      <p className="text-gray-500 text-xs mt-1">
        7-dagers vs 28-dagers rullende snitt av tonnasje
      </p>
    </div>
  )
}
