'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  }

  const getIcon = () => {
    if (theme === 'light') return <SunIcon className="w-5 h-5" />;
    if (theme === 'dark') return <MoonIcon className="w-5 h-5" />;
    return <ComputerDesktopIcon className="w-5 h-5" />;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-label="Toggle Theme"
        type="button"
        className="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-dark-background"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getIcon()}
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <button onClick={() => { setTheme('light'); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <SunIcon className="w-5 h-5 mr-2" /> Light
          </button>
          <button onClick={() => { setTheme('dark'); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoonIcon className="w-5 h-5 mr-2" /> Dark
          </button>
          <button onClick={() => { setTheme('system'); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ComputerDesktopIcon className="w-5 h-5 mr-2" /> System
          </button>
        </div>
      )}
    </div>
  )
}