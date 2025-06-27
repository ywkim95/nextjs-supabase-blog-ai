'use client'

import { useVisitorTracking } from '@/hooks/useVisitorTracking'

export default function VisitorStats() {
  const { dailyVisitors, totalVisitors, loading } = useVisitorTracking()

  if (loading) {
    return (
      <>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">-</div>
          <div className="text-sm text-gray-500">오늘 방문자</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">-</div>
          <div className="text-sm text-gray-500">총 방문자</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{dailyVisitors}</div>
        <div className="text-sm text-gray-500">오늘 방문자</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{totalVisitors}</div>
        <div className="text-sm text-gray-500">총 방문자</div>
      </div>
    </>
  )
}
