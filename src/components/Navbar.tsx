'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from './LocaleSwitcher'
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const t = useTranslations('Navbar')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{
    avatar_url: string | null
    username: string | null
  } | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
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

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        setIsAdmin(user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url, username')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }
      setLoading(false)
    }

    fetchUserAndProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setIsAdmin(session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
        const fetchProfile = async () => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('avatar_url, username')
            .eq('id', session.user!.id)
            .single()
          setProfile(profileData)
        }
        fetchProfile()
      } else {
        setIsAdmin(false)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase, supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Blog
            </Link>
            <div className="ml-8 hidden sm:flex sm:space-x-4">
              <Link
                href="/posts"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('allPosts')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LocaleSwitcher />
            {loading ? (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              isAdmin ? (
                <>
                  <Link
                    href="/dashboard/posts/new"
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
                        <UserCircleIcon className="h-8 w-8 text-gray-500" />
                      )}
                    </button>
                    {isMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="px-4 py-3">
                          <p className="text-sm">{t('signedInAs')}</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {profile?.username || user.email}
                          </p>
                        </div>
                        <div className="border-t border-gray-100" />
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-2" />
                          {t('dashboard')}
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2" />
                          {t('profile')}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          {t('signOut')}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('signOut')}
                </button>
              )
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
