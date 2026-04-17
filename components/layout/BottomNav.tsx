'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWorkout } from '@/context/WorkoutContext'

const navItems = [
  {
    href: '/',
    label: 'Hjem',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-green-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/workout',
    label: 'Trening',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-green-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    href: '/programs',
    label: 'Programmer',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-green-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'Historikk',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-green-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/guider',
    label: 'Guider',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-green-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Profil',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-green-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { state } = useWorkout()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-white/10 z-50">
      <div className="flex items-center justify-around h-16 pb-safe max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const isWorkout = item.href === '/workout'
          const hasActive = state.activeWorkout !== null

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-4 py-1 relative"
            >
              {isWorkout && hasActive && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
              {item.icon(isActive)}
              <span className={`text-xs ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
