import type { Metadata, Viewport } from 'next'
import './globals.css'
import { WorkoutProvider } from '@/context/WorkoutContext'
import BottomNav from '@/components/layout/BottomNav'
import OnboardingGate from '@/components/layout/OnboardingGate'
import OfflineToast from '@/components/layout/OfflineToast'
import StorageErrorBanner from '@/components/layout/StorageErrorBanner'

export const metadata: Metadata = {
  title: { default: 'WorkoutAI', template: '%s | WorkoutAI' },
  description: 'Smart treningsapp som automatiserer treningsvalgene dine',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WorkoutAI',
    startupImage: '/icons/apple-touch-icon.png',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'WorkoutAI',
    description: 'Smart treningsapp – offline-first, vitenskapelig fundert',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0f0f',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-white">
        <WorkoutProvider>
          <OnboardingGate>
            <OfflineToast />
            <StorageErrorBanner />
            <main className="flex-1 pb-20">
              {children}
            </main>
            <BottomNav />
          </OnboardingGate>
        </WorkoutProvider>
      </body>
    </html>
  )
}
