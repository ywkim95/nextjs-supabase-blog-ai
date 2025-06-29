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
  const [isResetMode, setIsResetMode] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('Admin email from env:', process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    console.log('Input email:', email)
    console.log('Email comparison:', email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    console.log('Email length env:', process.env.NEXT_PUBLIC_ADMIN_EMAIL?.length)
    console.log('Email length input:', email.length)
    console.log('Trimmed comparison:', email.trim() === process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim())

    if (email.trim() !== process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim()) {
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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('Admin email from env (reset):', process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    console.log('Input email (reset):', email)

    if (email.trim() !== process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim()) {
      toast.error(t('notAdminAccount'))
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/reset-password`,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('비밀번호 재설정 이메일이 발송되었습니다.')
        setIsResetMode(false)
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
            {isResetMode ? '비밀번호 재설정' : t('adminLogin')}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isResetMode ? handlePasswordReset : handleAdminLogin}>
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
            {!isResetMode && (
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
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? t('signingIn') : (isResetMode ? '재설정 이메일 발송' : t('signIn'))}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsResetMode(!isResetMode)}
              className="text-orange-600 hover:text-orange-500 text-sm font-medium"
            >
              {isResetMode ? '로그인으로 돌아가기' : '비밀번호를 잊으셨나요?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}