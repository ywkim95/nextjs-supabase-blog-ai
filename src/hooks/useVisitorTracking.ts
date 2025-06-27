'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useVisitorTracking() {
  const [dailyVisitors, setDailyVisitors] = useState<number>(0)
  const [totalVisitors, setTotalVisitors] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function trackVisitor() {
      const supabase = createClient()
      
      try {
        // Generate a visitor ID (using a combination of factors for uniqueness)
        const getVisitorId = () => {
          // Try to get existing visitor ID from localStorage
          let visitorId = localStorage.getItem('visitor_id')
          
          if (!visitorId) {
            // Generate new visitor ID
            visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem('visitor_id', visitorId)
          }
          
          return visitorId
        }

        const visitorId = getVisitorId()
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

        // Try to record the visitor (will be ignored if already exists for today)
        try {
          await supabase
            .from('daily_visitors')
            .insert({
              visitor_id: visitorId,
              visit_date: today
            })
            .select()
            .single()
        } catch (error) {
          // Ignore duplicate errors - visitor already counted today
        }

        // Get today's visitor count
        const { data: dailyCount } = await supabase
          .rpc('get_daily_visitor_count')

        // Get total unique visitors
        const { data: totalCount } = await supabase
          .rpc('get_total_visitor_count')

        setDailyVisitors(dailyCount || 0)
        setTotalVisitors(totalCount || 0)
        
      } catch (error) {
        console.error('Error tracking visitor:', error)
        // Set default values on error
        setDailyVisitors(0)
        setTotalVisitors(0)
      } finally {
        setLoading(false)
      }
    }

    trackVisitor()
  }, [])

  return { dailyVisitors, totalVisitors, loading }
}