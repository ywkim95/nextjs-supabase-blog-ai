import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['ko', 'en'],
  defaultLocale: 'ko'
})

export default async function middleware(request: NextRequest) {
  // 먼저 인증 체크 수행 (보안 강화)
  const authResponse = await updateSession(request)
  
  // 인증 체크에서 리다이렉트가 발생한 경우 바로 반환
  if (authResponse.status === 307 || authResponse.status === 302) {
    return authResponse
  }

  // 인증 체크가 통과되면 i18n 미들웨어 실행
  return intlMiddleware(request)
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
