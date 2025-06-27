import { createClient } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ko'],
  defaultLocale: 'ko',
  localePrefix: 'never'
});

export async function middleware(request: NextRequest) {
  // First, let next-intl handle the request to determine the locale
  const intlResponse = intlMiddleware(request);

  // Now, handle Supabase session and auth checks
  const { supabase, response } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session.user.email !== process.env.ADMIN_EMAIL) {
      // Redirect to home if not an admin
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If no auth redirects are needed, return the response from the intl middleware
  return intlResponse;
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
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}