// src/components/AuthButtons.tsx
'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import UserMenu from './UserMenu'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

export default function AuthButtons() {
  const t = useTranslations('common')
  const tAuth = useTranslations('auth')
  const locale = useLocale()
  const { user, profile, isAdmin, loading, handleSignOut } = useAuth()

  return (
    <div className="flex items-center space-x-4">
      {loading ? (
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      ) : user ? (
        <>
          {isAdmin && (
            <Link
              href={`/${locale}/dashboard/posts/new`}
              className="hidden sm:inline-flex items-center bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-700"
            >
              <PencilSquareIcon className="h-5 w-5 mr-2" />
              {t('writePost')}
            </Link>
          )}
          <UserMenu user={user} profile={profile} handleSignOut={handleSignOut} isAdmin={isAdmin} />
        </>
      ) : (
        <Link
          href={`/${locale}/login`}
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          {t('login')}
        </Link>
      )}
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  )
}
