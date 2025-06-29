// src/hooks/useAuth.ts
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ avatar_url: string | null; username: string | null } | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const tAuth = useTranslations('auth')
  const locale = useLocale()

  useEffect(() => {
    const fetchUserAndProfile = async (user: User | null) => {
      if (user) {
        setIsAdmin(user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url, username')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      } else {
        setIsAdmin(false)
        setProfile(null)
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      fetchUserAndProfile(data.session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      fetchUserAndProfile(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase, supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success(tAuth('logoutSuccess'))
    router.push(`/${locale}`)
    router.refresh()
  }

  return { user, profile, isAdmin, loading, handleSignOut }
}
