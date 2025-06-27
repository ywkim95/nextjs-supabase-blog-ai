import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'ko'],
  defaultLocale: 'ko',
  localePrefix: 'never' // URL에 locale을 표시하지 않음
});

export async function middleware(request: NextRequest) {
  // next-intl 미들웨어를 먼저 적용합니다.
  const response = intlMiddleware(request);

  // Supabase 클라이언트를 생성합니다.
  const { supabase } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // 대시보드 경로를 보호합니다.
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      // 인증되지 않은 경우 로그인 페이지로 리디렉션합니다.
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session.user.email !== process.env.ADMIN_EMAIL) {
      // 관리자가 아닌 경우 홈 페이지로 리디렉션합니다.
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}