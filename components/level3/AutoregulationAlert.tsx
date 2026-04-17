'use client'

import { WorkoutRecord } from '@/lib/types'
import { acuteChronicRatio, isStagnating, bestE1rmForExercise } from '@/lib/analytics'

interface AutoregulationAlertProps {
  history: WorkoutRecord[]
  exerciseId?: string
}

export default function AutoregulationAlert({ history, exerciseId }: AutoregulationAlertProps) {
  const acr = acuteChronicRatio(history)
  const stagnating = exerciseId
    ? isStagnating(bestE1rmForExercise(history, exerciseId))
    : false

  const alerts: { color: string; icon: string; text: string }[] = []

  if (acr !== null) {
    if (acr > 1.5) {
      alerts.push({
        color: 'border-red-500/40 bg-red-500/8 text-red-300',
        icon: '⚠️',
        text: `Akutt:kronisk ratio ${acr.toFixed(2)} – høy skaderisiko. Vurder redusert volum denne uken.`,
      })
    } else if (acr > 1.3) {
      alerts.push({
        color: 'border-orange-500/40 bg-orange-500/8 text-orange-300',
        icon: '📊',
        text: `Ratio ${acr.toFixed(2)} – litt høy belastning. Følg med på søvn og restitusjon.`,
      })
    } else if (acr < 0.7 && history.length > 4) {
      alerts.push({
        color: 'border-blue-500/40 bg-blue-500/8 text-blue-300',
        icon: '💤',
        text: `Ratio ${acr.toFixed(2)} – deload? Lav ukebetastning, god tid for aktiv restitusjon.`,
      })
    }
  }

  if (stagnating) {
    alerts.push({
      color: 'border-yellow-500/40 bg-yellow-500/8 text-yellow-300',
      icon: '📉',
      text: 'Stagnasjon detektert. Prøv ny reprekkevidde, variasjon eller deload-uke.',
    })
  }

  if (alerts.length === 0) return null

  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border ${a.color}`}>
          <span className="text-base shrink-0">{a.icon}</span>
          <p className="text-xs leading-relaxed">{a.text}</p>
        </div>
      ))}
    </div>
  )
}
