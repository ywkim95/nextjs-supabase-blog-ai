'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import { PencilIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
  const t = useTranslations('common')
  const locale = useLocale()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Check if user email is admin email
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com'
        setIsAdmin(user.email === adminEmail)
      } else {
        setIsAdmin(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Check if user email is admin email
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com'
        setIsAdmin(session.user.email === adminEmail)
      } else {
        setIsAdmin(false)
      }
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
                  {isAdmin && (
                    <Link
                      href={`/${locale}/dashboard/posts/new`}
                      className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>{t('writePost')}</span>
                    </Link>
                  )}
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
