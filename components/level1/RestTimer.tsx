'use client'

import { useState, useEffect, useRef } from 'react'

interface RestTimerProps {
  seconds: number          // recommended rest in seconds
  onDone?: () => void
  autoStart?: boolean
}

export default function RestTimer({ seconds, onDone, autoStart = true }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setRemaining(seconds)
    setRunning(autoStart)
  }, [seconds, autoStart])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          onDone?.()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [running, onDone])

  const pct = (remaining / seconds) * 100
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`

  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="none" strokeWidth="4" stroke="rgba(255,255,255,0.08)" />
          <circle
            cx="48" cy="48" r={r}
            fill="none" strokeWidth="4"
            stroke={remaining === 0 ? '#22c55e' : '#3b82f6'}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold tabular-nums ${remaining === 0 ? 'text-green-400' : 'text-white'}`}>
            {remaining === 0 ? '✓' : timeStr}
          </span>
        </div>
      </div>

      <p className="text-gray-400 text-sm">
        {remaining === 0 ? 'Klar for neste sett!' : 'Hviler...'}
      </p>

      <div className="flex gap-3">
        {running ? (
          <button
            onClick={() => setRunning(false)}
            className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={() => { setRemaining(seconds); setRunning(true) }}
            className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full"
          >
            Restart
          </button>
        )}
        <button
          onClick={() => { setRemaining(0); setRunning(false); onDone?.() }}
          className="text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full"
        >
          Hopp over
        </button>
      </div>
    </div>
  )
}
