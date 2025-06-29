import { NextRequest, NextResponse } from 'next/server'
import { strictLimiter, getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting 적용 (브루트 포스 공격 방지)
  const clientIP = getClientIP(request)
  const rateLimitKey = `admin-check:${clientIP}`
  
  if (!strictLimiter.isAllowed(rateLimitKey)) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        resetTime: strictLimiter.getResetTime(rateLimitKey)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': '900', // 15분
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': strictLimiter.getRemainingRequests(rateLimitKey).toString(),
          'X-RateLimit-Reset': strictLimiter.getResetTime(rateLimitKey).toString()
        }
      }
    )
  }

  try {
    const body = await request.json()
    
    // 입력 검증 강화
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string' },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    const trimmedEmail = email.trim()
    
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    const isAdmin = trimmedEmail.toLowerCase() === adminEmail.trim().toLowerCase()
    
    return NextResponse.json({ isAdmin })
  } catch (error) {
    // 보안을 위해 상세한 에러 정보는 로그에만 기록
    console.error('Admin check error:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // 클라이언트에는 일반적인 에러 메시지만 반환
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}