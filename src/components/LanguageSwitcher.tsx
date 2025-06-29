'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useTransition } from 'react'
import { LanguageIcon } from '@heroicons/react/24/outline'

const languages = [
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'en', name: 'English', nativeName: 'English' }
]

export default function LanguageSwitcher() {
  const t = useTranslations('language')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const switchLanguage = (newLocale: string) => {
    setIsOpen(false)
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('selectLanguage')}
        disabled={isPending}
      >
        <LanguageIcon className="h-5 w-5" />
        <span className="hidden sm:block">{currentLanguage?.nativeName}</span>
        {isPending && <span className="ml-2">...</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  locale === language.code
                    ? 'bg-gray-100 dark:bg-gray-700 text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                role="menuitem"
                disabled={isPending}
              >
                <div className="flex items-center justify-between">
                  <span>{language.nativeName}</span>
                  {locale === language.code && (
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
