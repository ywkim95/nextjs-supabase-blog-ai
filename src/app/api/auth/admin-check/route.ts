import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // 서버 사이드에서만 접근 가능한 환경변수 사용
    const adminEmail = process.env.ADMIN_EMAIL
    
    if (!adminEmail) {
      console.error('ADMIN_EMAIL environment variable not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const isAdmin = email.trim().toLowerCase() === adminEmail.trim().toLowerCase()
    
    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}