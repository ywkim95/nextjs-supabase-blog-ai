'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronUpIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function FloatingActionButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const themeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setShowThemeDropdown(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
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

  const themeOptions = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerDesktopIcon }
  ]

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

      {/* Theme Dropdown Button */}
      <div className="relative" ref={themeDropdownRef}>
        <button
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
          className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-dark-accent dark:hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center"
          aria-label={`Change theme (current: ${theme})`}
        >
          {getThemeIcon()}
        </button>

        {/* Theme Dropdown */}
        {showThemeDropdown && (
          <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-2 min-w-[120px] animate-fade-in">
            {themeOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value)
                    setShowThemeDropdown(false)
                  }}
                  className={`
                    w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    ${theme === option.value ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{option.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}