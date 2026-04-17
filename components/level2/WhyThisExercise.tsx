'use client'

import { useState } from 'react'
import { Exercise } from '@/lib/types'

interface WhyThisExerciseProps {
  exercise: Exercise
  lastTrainedDays?: number
  reason?: string
}

function buildReason(muscleGroup: string, days?: number): string {
  if (days === undefined || days === Infinity || days > 365) {
    return 'Ikke trent ennå – god start for ny stimulering.'
  }
  if (days < 1) {
    return 'Trent i dag – dette er en lett oppfølging av dagens belastning.'
  }
  if (days < 2) {
    return `Trent for ${Math.round(days * 24)} timer siden – vurder lettere intensitet.`
  }
  if (days < 3) {
    return `${Math.floor(days)} dag siden siste økt – delvis restituert.`
  }
  return `${Math.floor(days)} dager siden sist – fullt restituert og klar for ny belastning.`
}

export default function WhyThisExercise({ exercise, lastTrainedDays, reason }: WhyThisExerciseProps) {
  const [open, setOpen] = useState(false)
  const text = reason ?? buildReason(exercise.muscleGroup, lastTrainedDays)

  return (
    <div>
      <button
        onClick={() => setOpen((x) => !x)}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
      >
        <span>Hvorfor denne øvelsen?</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2 p-3 bg-blue-500/8 border border-blue-500/20 rounded-xl">
          <p className="text-blue-300 text-xs leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  )
}
