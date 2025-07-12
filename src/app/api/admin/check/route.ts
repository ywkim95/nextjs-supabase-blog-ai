import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.json({ 
        isAdmin: false, 
        debug: { error: error.message, user: null, adminEmail: process.env.ADMIN_EMAIL }
      })
    }

    if (!user) {
      return NextResponse.json({ 
        isAdmin: false, 
        debug: { error: 'No user', user: null, adminEmail: process.env.ADMIN_EMAIL }
      })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const isAdmin = user.email === adminEmail

    return NextResponse.json({ 
      isAdmin,
      debug: { 
        userEmail: user.email, 
        adminEmail, 
        match: user.email === adminEmail 
      }
    })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ 
      isAdmin: false, 
      debug: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
}