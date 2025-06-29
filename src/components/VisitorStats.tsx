'use client'

import { useVisitorTracking } from '@/hooks/useVisitorTracking'
import { useTranslations } from 'next-intl'

export default function VisitorStats() {
  const { dailyVisitors, totalVisitors, loading } = useVisitorTracking()
  const t = useTranslations('home')

  if (loading) {
    return (
      <>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">-</div>
          <div className="text-sm text-gray-500">{t('dailyVisitors')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">-</div>
          <div className="text-sm text-gray-500">{t('totalVisitors')}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{dailyVisitors}</div>
        <div className="text-sm text-gray-500">{t('dailyVisitors')}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{totalVisitors}</div>
        <div className="text-sm text-gray-500">{t('totalVisitors')}</div>
      </div>
    </>
  )
}
