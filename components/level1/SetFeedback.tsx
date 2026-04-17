'use client'

import { SetFeedback as FeedbackType } from '@/lib/types'

interface SetFeedbackProps {
  value?: FeedbackType
  onChange: (v: FeedbackType) => void
}

const OPTIONS: { value: FeedbackType; emoji: string; label: string; color: string }[] = [
  { value: 'too_easy', emoji: '😴', label: 'For lett', color: 'border-blue-500 bg-blue-500/15 text-blue-300' },
  { value: 'just_right', emoji: '😤', label: 'Passer', color: 'border-green-500 bg-green-500/15 text-green-300' },
  { value: 'too_hard', emoji: '😰', label: 'For tungt', color: 'border-orange-500 bg-orange-500/15 text-orange-300' },
]

export default function SetFeedback({ value, onChange }: SetFeedbackProps) {
  return (
    <div className="flex gap-2 justify-center">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-all ${
            value === o.value
              ? o.color
              : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
          }`}
        >
          <span className="text-xl">{o.emoji}</span>
          <span className="text-xs">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
