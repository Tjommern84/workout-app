'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { loadProfile } from '@/lib/storage'

export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/onboarding') return
    const profile = loadProfile().data
    if (!profile?.onboardingComplete || !profile.gender || !profile.age) {
      router.replace('/onboarding')
    }
  }, [pathname, router])

  return <>{children}</>
}
