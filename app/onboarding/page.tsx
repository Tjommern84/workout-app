'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserLevel, UserGoal, Equipment, UserProfile, Gender } from '@/lib/types'
import { saveProfile } from '@/lib/storage'
import { getProgramForDays } from '@/lib/programs'

type Step = 'gender' | 'age' | 'goal' | 'level' | 'days' | 'equipment'

const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male',   emoji: '♂',  label: 'Mann'  },
  { value: 'female', emoji: '♀',  label: 'Kvinne' },
  { value: 'other',  emoji: '⊕',  label: 'Annet'  },
]

const GOAL_OPTIONS: { value: UserGoal; label: string; emoji: string; desc: string }[] = [
  { value: 'lose_fat',        emoji: '🔥', label: 'Forbrenne fett',  desc: 'Kalorioppsett + HIIT-orientert'       },
  { value: 'build_muscle',    emoji: '💪', label: 'Bygge muskler',   desc: 'Hypertrofi – volum og progresjon'     },
  { value: 'get_stronger',    emoji: '🏋️', label: 'Bli sterkere',    desc: 'Styrke – tunge løft og lave reps'    },
  { value: 'improve_fitness', emoji: '🫀', label: 'Bedre kondis',    desc: 'Kardio + funksjonell styrke'          },
  { value: 'general_health',  emoji: '🌱', label: 'Generell helse',  desc: 'Balansert, bærekraftig trening'       },
]

const LEVEL_OPTIONS: { value: UserLevel; label: string; emoji: string; desc: string }[] = [
  {
    value: 'guide',
    emoji: '🟢',
    label: 'Veiledd meg',
    desc: 'Jeg er ny eller trenger tydelig veiledning. Vis meg hva jeg skal gjøre steg for steg.',
  },
  {
    value: 'structure',
    emoji: '🔵',
    label: 'Gi meg struktur',
    desc: 'Jeg kjenner grunnleggende trening. Vil ha progresjon og innsikt, men uten støy.',
  },
  {
    value: 'data',
    emoji: '🟣',
    label: 'Full datakontroll',
    desc: 'Jeg vil ha RPE, e1RM-trender, autoregulering og alle tallene.',
  },
]

const EQUIPMENT_OPTIONS: { value: Equipment; label: string; emoji: string }[] = [
  { value: 'barbell',    emoji: '🏋️', label: 'Vektstang'   },
  { value: 'dumbbell',   emoji: '🥊', label: 'Manualer'    },
  { value: 'machine',    emoji: '⚙️', label: 'Maskiner'    },
  { value: 'cable',      emoji: '🔗', label: 'Kabelmaskin' },
  { value: 'kettlebell', emoji: '🔔', label: 'Kettlebell'  },
  { value: 'bodyweight', emoji: '🤸', label: 'Kroppsvekt'  },
]

const STEP_ORDER: Step[] = ['gender', 'age', 'goal', 'level', 'days', 'equipment']
const TOTAL = STEP_ORDER.length

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('gender')
  const [gender, setGender] = useState<Gender | null>(null)
  const [age, setAge] = useState(30)
  const [goal, setGoal] = useState<UserGoal | null>(null)
  const [level, setLevel] = useState<UserLevel | null>(null)
  const [days, setDays] = useState(3)
  const [equipment, setEquipment] = useState<Equipment[]>(['barbell', 'dumbbell', 'machine'])

  function next() {
    const idx = STEP_ORDER.indexOf(step)
    if (idx < STEP_ORDER.length - 1) setStep(STEP_ORDER[idx + 1])
  }

  function back() {
    const idx = STEP_ORDER.indexOf(step)
    if (idx > 0) setStep(STEP_ORDER[idx - 1])
  }

  function toggleEquipment(e: Equipment) {
    setEquipment((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    )
  }

  function finish() {
    if (!goal || !level || !gender) return
    const profile: UserProfile = {
      level,
      goal,
      gender,
      age,
      daysPerWeek: days,
      equipment,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    }
    saveProfile(profile)
    router.push('/')
  }

  const progress = STEP_ORDER.indexOf(step) + 1

  // Aldersgruppe-etikett
  function ageGroupLabel(a: number) {
    if (a < 18) return 'Under 18'
    if (a < 36) return '18–35 år – optimal adaptasjon og restitusjon'
    if (a < 60) return '36–59 år – moderat restitusjonsbehov'
    return '60+ år – ekstra hvile anbefales mellom sett'
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${(progress / TOTAL) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-6 pt-10 pb-8">

        {/* ── Steg 1: Kjønn ── */}
        {step === 'gender' && (
          <>
            <p className="text-gray-500 text-sm mb-1">Steg 1 av {TOTAL}</p>
            <h1 className="text-2xl font-bold mb-2">Hvem er du?</h1>
            <p className="text-gray-400 text-sm mb-8">
              Kjønn påvirker frekvensanbefalinger og programtilpasning.
            </p>
            <div className="grid grid-cols-3 gap-3 flex-1">
              {GENDER_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { setGender(o.value); next() }}
                  className={`flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border transition-all ${
                    gender === o.value
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl">{o.emoji}</span>
                  <span className="font-semibold text-sm">{o.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Steg 2: Alder ── */}
        {step === 'age' && (
          <>
            <p className="text-gray-500 text-sm mb-1">Steg 2 av {TOTAL}</p>
            <h1 className="text-2xl font-bold mb-2">Hvor gammel er du?</h1>
            <p className="text-gray-400 text-sm mb-8">
              Alder justerer anbefalt hviletid og restitusjonskrav.
            </p>

            <div className="mb-8">
              <div className="flex items-end justify-between mb-4">
                <span className="text-7xl font-bold text-green-400 tabular-nums">{age}</span>
                <span className="text-gray-500 text-sm pb-3">år</span>
              </div>
              <input
                type="range"
                min={13}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-green-500 h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1 px-0.5">
                <span>13</span>
                <span>50</span>
                <span>90</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-2xl p-4 mb-8">
              <p className="text-xs text-gray-500 mb-1">Tilpasning</p>
              <p className="text-sm text-gray-200">{ageGroupLabel(age)}</p>
            </div>

            <div className="flex gap-3 mt-auto">
              <button onClick={back} className="text-gray-500 text-sm px-4">← Tilbake</button>
              <button onClick={next} className="flex-1 bg-green-500 text-black font-bold py-4 rounded-2xl">
                Neste
              </button>
            </div>
          </>
        )}

        {/* ── Steg 3: Mål ── */}
        {step === 'goal' && (
          <>
            <p className="text-gray-500 text-sm mb-1">Steg 3 av {TOTAL}</p>
            <h1 className="text-2xl font-bold mb-2">Hva er ditt treningsmål?</h1>
            <p className="text-gray-400 text-sm mb-8">
              Appen tilpasser programmer og innsikt etter dette.
            </p>
            <div className="space-y-3 flex-1">
              {GOAL_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { setGoal(o.value); next() }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    goal === o.value
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{o.emoji}</span>
                    <div>
                      <p className="font-semibold">{o.label}</p>
                      <p className="text-gray-400 text-xs">{o.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={back} className="mt-6 text-gray-500 text-sm">← Tilbake</button>
          </>
        )}

        {/* ── Steg 4: Nivå ── */}
        {step === 'level' && (
          <>
            <p className="text-gray-500 text-sm mb-1">Steg 4 av {TOTAL}</p>
            <h1 className="text-2xl font-bold mb-2">Hvordan vil du bruke appen?</h1>
            <p className="text-gray-400 text-sm mb-8">
              Du kan endre dette når som helst i innstillinger.
            </p>
            <div className="space-y-4 flex-1">
              {LEVEL_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { setLevel(o.value); next() }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    level === o.value
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{o.emoji}</span>
                    <div>
                      <p className="font-bold text-lg">{o.label}</p>
                      <p className="text-gray-400 text-sm mt-1 leading-relaxed">{o.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={back} className="mt-6 text-gray-500 text-sm">← Tilbake</button>
          </>
        )}

        {/* ── Steg 5: Dager ── */}
        {step === 'days' && (() => {
          const program = getProgramForDays(days)
          return (
            <>
              <p className="text-gray-500 text-sm mb-1">Steg 5 av {TOTAL}</p>
              <h1 className="text-2xl font-bold mb-2">Hvor mange økter per uke?</h1>
              <p className="text-gray-400 text-sm mb-8">
                Generatoren tilpasser program og volum etter dette.
              </p>

              <div className="mb-6">
                <div className="flex items-end justify-between mb-3">
                  <span className="text-6xl font-bold text-green-400 tabular-nums">{days}</span>
                  <span className="text-gray-500 text-sm pb-2">økter / uke</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-green-500 h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1 px-0.5">
                  <span>1</span><span>5</span><span>10</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/8">
                <p className="text-xs text-gray-500 mb-1">Programmet du får</p>
                <p className="font-bold text-base mb-1">{program.name}</p>
                <p className="text-gray-400 text-sm mb-3">{program.description}</p>
                <div className="space-y-1.5">
                  {program.days.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-400 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <span className="text-gray-300">{d.label}</span>
                        {d.labelFriendly && (
                          <p className="text-gray-500 text-xs mt-0.5">{d.labelFriendly}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button onClick={back} className="text-gray-500 text-sm px-4">← Tilbake</button>
                <button onClick={next} className="flex-1 bg-green-500 text-black font-bold py-4 rounded-2xl">
                  Neste
                </button>
              </div>
            </>
          )
        })()}

        {/* ── Steg 6: Utstyr ── */}
        {step === 'equipment' && (
          <>
            <p className="text-gray-500 text-sm mb-1">Steg 6 av {TOTAL}</p>
            <h1 className="text-2xl font-bold mb-2">Hva har du tilgang til?</h1>
            <p className="text-gray-400 text-sm mb-8">Velg alt som stemmer.</p>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {EQUIPMENT_OPTIONS.map((o) => {
                const selected = equipment.includes(o.value)
                return (
                  <button
                    key={o.value}
                    onClick={() => toggleEquipment(o.value)}
                    className={`p-4 rounded-2xl border transition-all text-left ${
                      selected
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 bg-white/3 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{o.emoji}</span>
                    <span className="font-semibold text-sm">{o.label}</span>
                    {selected && <span className="text-green-400 text-xs block mt-0.5">✓ Valgt</span>}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-600 text-center px-2 pt-4">
              Har du kjente helseproblemer eller hjertesykdom? Konsulter lege før du starter et nytt treningsprogram.
            </p>
            <div className="flex gap-3 pt-3">
              <button onClick={back} className="text-gray-500 text-sm px-4">← Tilbake</button>
              <button
                onClick={finish}
                disabled={equipment.length === 0}
                className="flex-1 bg-green-500 disabled:bg-green-900 disabled:text-green-700 text-black font-bold py-4 rounded-2xl transition-colors"
              >
                Start treningen 🚀
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
