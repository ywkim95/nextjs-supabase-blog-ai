import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Supabase Blog',
  description: 'A modern blog built with Next.js and Supabase',
}

import { Providers } from './providers'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children
}: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}