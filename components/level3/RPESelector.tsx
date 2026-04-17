'use client'

interface RPESelectorProps {
  value?: number
  onChange: (rpe: number) => void
}

const RPE_LABELS: Record<number, string> = {
  6: 'Veldig lett',
  7: 'Lett',
  7.5: 'Lett–moderat',
  8: 'Moderat',
  8.5: 'Moderat–hard',
  9: 'Hard',
  9.5: 'Nesten maks',
  10: 'Maks',
}

const RPE_VALUES = [6, 7, 7.5, 8, 8.5, 9, 9.5, 10]

function rpeColor(rpe: number): string {
  if (rpe <= 7) return 'border-green-500 bg-green-500/15 text-green-300'
  if (rpe <= 8) return 'border-yellow-500 bg-yellow-500/15 text-yellow-300'
  if (rpe <= 9) return 'border-orange-500 bg-orange-500/15 text-orange-300'
  return 'border-red-500 bg-red-500/15 text-red-300'
}

export default function RPESelector({ value, onChange }: RPESelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">RPE (Rate of Perceived Exertion)</p>
      <div className="flex flex-wrap gap-1.5">
        {RPE_VALUES.map((rpe) => (
          <button
            key={rpe}
            onClick={() => onChange(rpe)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              value === rpe
                ? rpeColor(rpe)
                : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
            }`}
          >
            {rpe}
          </button>
        ))}
      </div>
      {value !== undefined && (
        <p className="text-xs text-gray-400">
          RPE {value} – {RPE_LABELS[value] ?? ''}
        </p>
      )}
    </div>
  )
}
