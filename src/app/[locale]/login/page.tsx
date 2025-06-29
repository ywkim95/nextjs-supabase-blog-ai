'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

export default function Login() {
  const t = useTranslations('auth')
  const params = useParams()
  const locale = params.locale as string
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      toast.error(t('notAdminAccount'))
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success(t('loginSuccess'))
        router.push(`/${locale}/dashboard`)
        router.refresh()
      }
    } catch (error) {
      toast.error(t('unexpectedError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-dark-text">
            {t('adminLogin')}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                {t('email')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-dark-text bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-dark-text bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}