import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from './src/lib/supabase/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['ko', 'en'],
  defaultLocale: 'ko'
})

export async function middleware(request: NextRequest) {
  // Handle internationalization first
  const intlResponse = intlMiddleware(request)
  
  // Create Supabase client
  const { supabase, response } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Extract locale from pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/'

  // Protect dashboard routes
  if (pathnameWithoutLocale.startsWith('/dashboard')) {
    if (!session) {
      // Redirect to login if not authenticated
      const locale = pathname.startsWith('/en') ? 'en' : 'ko'
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }

    if (session.user.email !== process.env.ADMIN_EMAIL) {
      // Redirect to home if not an admin
      const locale = pathname.startsWith('/en') ? 'en' : 'ko'
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
  }

  // If intl middleware returned a response (redirect), use it
  if (intlResponse && intlResponse.status !== 200) {
    return intlResponse
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
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*),'
  ]
}
