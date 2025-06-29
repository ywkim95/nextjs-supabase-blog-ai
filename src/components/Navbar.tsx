'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const t = useTranslations('common')
  const tAuth = useTranslations('auth')
  const locale = useLocale()
  const { user, profile, isAdmin, loading, handleSignOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white dark:bg-dark-background shadow-sm border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="text-xl font-bold text-gray-900 dark:text-dark-text">
              {t('blog')}
            </Link>
            <div className="ml-8 hidden sm:flex sm:space-x-4">
              <Link
                href={`/${locale}/posts`}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('allPosts')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ) : user ? (
              isAdmin ? (
                <>
                  <Link
                    href={`/${locale}/dashboard/posts/new`}
                    className="hidden sm:inline-flex items-center bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-700"
                  >
                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                    {t('writePost')}
                  </Link>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <span className="sr-only">Open user menu</span>
                      {profile?.avatar_url ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={profile.avatar_url}
                          alt="User profile"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                    {isMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {profile?.username || user.email}
                          </p>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700" />
                        <Link
                          href={`/${locale}/dashboard`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-2" />
                          {t('dashboard')}
                        </Link>
                        <Link
                          href={`/${locale}/profile`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2" />
                          {t('profile')}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          {tAuth('signOut')}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {tAuth('signOut')}
                </button>
              )
            ) : null}
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
