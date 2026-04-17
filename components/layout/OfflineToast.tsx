'use client'

import { useEffect, useState } from 'react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export default function OfflineToast() {
  const online = useNetworkStatus()
  const [visible, setVisible] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)
  const [backOnline, setBackOnline] = useState(false)

  useEffect(() => {
    if (!online) {
      setVisible(true)
      setWasOffline(true)
      setBackOnline(false)
    } else if (wasOffline) {
      setVisible(true)
      setBackOnline(true)
      const t = setTimeout(() => {
        setVisible(false)
        setWasOffline(false)
        setBackOnline(false)
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [online, wasOffline])

  if (!visible) return null

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-lg flex items-center gap-2 transition-all duration-300 ${
      backOnline
        ? 'bg-green-500/20 border border-green-500/40 text-green-300'
        : 'bg-[#1a1a1a] border border-white/10 text-gray-300'
    }`}>
      {backOnline ? (
        <><span>✓</span><span>Tilkoblet igjen – data synkronisert</span></>
      ) : (
        <><span>📵</span><span>Offline – treningsøkten lagres lokalt</span></>
      )}
    </div>
  )
}
