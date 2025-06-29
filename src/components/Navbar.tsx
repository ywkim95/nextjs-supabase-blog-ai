'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import AuthButtons from './AuthButtons'

export default function Navbar() {
  const t = useTranslations('common')
  const locale = useLocale()

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
          <AuthButtons />
        </div>
      </div>
    </nav>
  )
}
