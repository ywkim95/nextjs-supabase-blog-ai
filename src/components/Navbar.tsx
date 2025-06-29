'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

export default function Navbar() {
  const t = useTranslations('common')
  const locale = useLocale()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-white dark:bg-dark-background shadow-sm border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="text-xl font-bold text-gray-900 dark:text-dark-text">
              YWKim
            </Link>
            <div className="ml-8 hidden sm:flex sm:space-x-4">
              <Link
                href={`/${locale}/posts`}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('allPosts')}
              </Link>
              {user && (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('dashboard')}
                  </Link>
                  <Link
                    href={`/${locale}/profile`}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('profile')}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {user && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = `/${locale}`
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
