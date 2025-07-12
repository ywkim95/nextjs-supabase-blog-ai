'use client'

import { useState, useEffect } from 'react'
import { ChevronUpIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function FloatingActionButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const toggleLanguage = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko'
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  const getThemeIcon = () => {
    if (!mounted) return <ComputerDesktopIcon className="w-5 h-5" />
    
    switch (theme) {
      case 'light':
        return <SunIcon className="w-5 h-5" />
      case 'dark':
        return <MoonIcon className="w-5 h-5" />
      default:
        return <ComputerDesktopIcon className="w-5 h-5" />
    }
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`
          w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-dark-accent dark:hover:bg-orange-600
          text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
        aria-label="Scroll to top"
      >
        <ChevronUpIcon className="w-6 h-6" />
      </button>

      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center"
        aria-label={`Switch to ${locale === 'ko' ? 'English' : '한국어'}`}
      >
        <LanguageIcon className="w-6 h-6" />
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={cycleTheme}
        className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center"
        aria-label={`Switch theme (current: ${theme})`}
      >
        {getThemeIcon()}
      </button>
    </div>
  )
}