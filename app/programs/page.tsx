'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PROGRAMS } from '@/lib/programs'
import { Program, ProgramDay, FocusMode } from '@/lib/types'
import { FOCUS_MODE_TEMPLATES, generateProgramWorkout, defaultFocusMode } from '@/lib/generator'
import { loadProfile } from '@/lib/storage'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'
import { useWorkout } from '@/context/WorkoutContext'
import { getByIds } from '@/lib/exercises'
import { startCycle as createCycle } from '@/lib/cycles'
import CycleProgressWidget from '@/components/dashboard/CycleProgressWidget'

export default function ProgramsPage() {
  const [selected, setSelected] = useState<Program | null>(null)
  const [selectedDay, setSelectedDay] = useState<ProgramDay | null>(null)
  const [showFocusSheet, setShowFocusSheet] = useState(false)
  const [showCycleSheet, setShowCycleSheet] = useState<Program | null>(null)
  const { state, startCycle, abandonCycle } = useWorkout()

  function handleDaySelect(day: ProgramDay) {
    setSelectedDay(day)
    setShowFocusSheet(true)
  }

  const activeCycle = state.activeCycle

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Treningsprogrammer</h1>
        <p className="text-gray-400 text-sm mt-1">Velg et program og start en dag</p>
      </div>

      {activeCycle && (
        <div className="mb-6">
          <CycleProgressWidget
            cycle={activeCycle}
            onAbandon={activeCycle.status === 'active' ? abandonCycle : undefined}
          />
        </div>
      )}

      {PROGRAMS.map(program => (
        <ProgramCard
          key={program.id}
          program={program}
          isOpen={selected?.id === program.id}
          isActiveCycle={activeCycle?.programId === program.id && activeCycle.status === 'active'}
          onToggle={() => setSelected(selected?.id === program.id ? null : program)}
          onDaySelect={handleDaySelect}
          onStartCycle={() => setShowCycleSheet(program)}
        />
      ))}

      {showFocusSheet && selectedDay && (
        <FocusSelectSheet
          day={selectedDay}
          onClose={() => setShowFocusSheet(false)}
        />
      )}

      {showCycleSheet && (
        <StartCycleSheet
          program={showCycleSheet}
          hasActiveCycle={!!activeCycle && activeCycle.status === 'active'}
          onConfirm={(targetWeeks, targetPerWeek) => {
            const cycle = createCycle(showCycleSheet.id, showCycleSheet.name, { targetWeeks, targetWorkoutsPerWeek: targetPerWeek })
            startCycle(cycle)
            setShowCycleSheet(null)
          }}
          onClose={() => setShowCycleSheet(null)}
        />
      )}
    </div>
  )
}

function ProgramCard({
  program,
  isOpen,
  isActiveCycle,
  onToggle,
  onDaySelect,
  onStartCycle,
}: {
  program: Program
  isOpen: boolean
  isActiveCycle: boolean
  onToggle: () => void
  onDaySelect: (day: ProgramDay) => void
  onStartCycle: () => void
}) {
  return (
    <div className={`bg-[#1a1a1a] rounded-2xl border mb-4 overflow-hidden ${isActiveCycle ? 'border-blue-500/40' : 'border-white/5'}`}>
      <button
        className="w-full px-4 py-4 text-left flex items-start justify-between"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg">{program.name}</h2>
            {isActiveCycle && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Aktiv syklus</span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-0.5">{program.description}</p>
          <p className="text-xs text-gray-600 mt-1">{program.days.length} dager</p>
        </div>
        <span className="text-gray-500 ml-2 mt-1 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ↓
        </span>
      </button>

      {isOpen && (() => {
        const profileResult = loadProfile()
        const userEquipment = profileResult.ok && profileResult.data ? profileResult.data.equipment : []
        return (
          <div className="border-t border-white/5 p-4 space-y-3">
            {program.days.map((day, i) => {
              const mismatches = getByIds(day.exerciseIds).filter(ex =>
                userEquipment.length > 0 && !ex.equipmentTypes.some(eq => userEquipment.includes(eq))
              )
              return (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{day.label}</p>
                      {day.labelFriendly && (
                        <p className="text-xs text-gray-500 mt-0.5">{day.labelFriendly}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {day.muscleGroups.map(g => (
                          <span key={g} className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                            {MUSCLE_GROUP_LABELS[g]}
                          </span>
                        ))}
                      </div>
                      {mismatches.length > 0 && (
                        <p className="text-xs text-yellow-400 mt-1.5">
                          ⚠️ {mismatches.length} øvelse{mismatches.length !== 1 ? 'r' : ''} krever utstyr du ikke har valgt
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onDaySelect(day)}
                      className="bg-green-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg ml-2 flex-shrink-0"
                    >
                      Start
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {getByIds(day.exerciseIds).map(ex => (
                      <p key={ex.id} className="text-xs text-gray-500">• {ex.name}</p>
                    ))}
                  </div>
                </div>
              )
            })}
            {!isActiveCycle && (
              <button
                onClick={onStartCycle}
                className="w-full mt-1 border border-blue-500/40 text-blue-400 text-sm font-medium py-2.5 rounded-xl hover:bg-blue-500/10 transition-colors"
              >
                Start 8-ukers syklus
              </button>
            )}
          </div>
        )
      })()}
    </div>
  )
}

function FocusSelectSheet({ day, onClose }: { day: ProgramDay; onClose: () => void }) {
  const profileResult = loadProfile()
  const profile = profileResult.ok && profileResult.data ? profileResult.data : null
  const recommended = profile ? defaultFocusMode(profile.goal) : 'hypertrophy'
  const [selected, setSelected] = useState<FocusMode>(recommended)
  const { startWorkout, state } = useWorkout()
  const router = useRouter()

  function handleStart() {
    const profile = loadProfile()
    const age = profile.ok && profile.data ? profile.data.age : undefined
    const workout = generateProgramWorkout(day, selected, age)
    startWorkout(workout)
    onClose()
    router.push('/workout')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-[#1a1a1a] rounded-t-3xl p-6 pb-10 border-t border-white/10 max-w-lg mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        <h2 className="text-xl font-bold mb-0.5">{day.label}</h2>
        <p className="text-gray-400 text-sm mb-6">Velg treningsfokus for denne økten</p>

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
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {state.activeWorkout && (
          <p className="text-yellow-400 text-xs text-center mb-3">
            Du har en aktiv økt – den vil bli erstattet
          </p>
        )}

        <button
          onClick={handleStart}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl text-lg transition-colors"
        >
          Start {day.label} →
        </button>
      </div>
    </div>
  )
}

function StartCycleSheet({
  program,
  hasActiveCycle,
  onConfirm,
  onClose,
}: {
  program: Program
  hasActiveCycle: boolean
  onConfirm: (targetWeeks: number, targetPerWeek: number) => void
  onClose: () => void
}) {
  const [weeks, setWeeks] = useState(8)
  const [perWeek, setPerWeek] = useState(2)

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-[#1a1a1a] rounded-t-3xl p-6 pb-10 border-t border-white/10 max-w-lg mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold mb-1">Start syklus</h2>
        <p className="text-gray-400 text-sm mb-6">{program.name}</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Varighet</label>
            <div className="flex gap-2">
              {[4, 6, 8, 12].map(w => (
                <button
                  key={w}
                  onClick={() => setWeeks(w)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    weeks === w ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {w} uker
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Mål per uke</label>
            <div className="flex gap-2">
              {[2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setPerWeek(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    perWeek === n ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {n} økter
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-6">
          Uker der du logger færre enn {perWeek} økter telles ikke — syklusen justeres automatisk.
        </p>

        {hasActiveCycle && (
          <p className="text-xs text-yellow-400 mb-3 text-center">
            Dette vil avslutte din nåværende aktive syklus
          </p>
        )}

        <button
          onClick={() => onConfirm(weeks, perWeek)}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-2xl text-lg transition-colors"
        >
          Start {weeks}-ukers syklus →
        </button>
      </div>
    </div>
  )
}
