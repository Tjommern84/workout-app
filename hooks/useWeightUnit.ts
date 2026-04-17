'use client'

import { useWorkout } from '@/context/WorkoutContext'

export function useWeightUnit() {
  const { state } = useWorkout()
  const unit = state.settings.weightUnit ?? 'kg'

  function format(kg: number, decimals = 1): string {
    if (unit === 'lbs') return `${(kg * 2.20462).toFixed(decimals)} lbs`
    // Show whole number if no decimals needed
    return Number.isInteger(kg) ? `${kg} kg` : `${kg} kg`
  }

  function formatShort(kg: number): string {
    if (unit === 'lbs') return `${Math.round(kg * 2.20462)} lbs`
    return `${kg}kg`
  }

  function toDisplay(kg: number): number {
    if (unit === 'lbs') return Math.round(kg * 2.20462 * 10) / 10
    return kg
  }

  function fromDisplay(val: number): number {
    if (unit === 'lbs') {
      // Round to nearest 0.25 kg to match plate precision and prevent drift
      return Math.round((val / 2.20462) * 4) / 4
    }
    return val
  }

  return { unit, format, formatShort, toDisplay, fromDisplay }
}
