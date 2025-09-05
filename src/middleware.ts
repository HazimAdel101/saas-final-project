import { clerkMiddleware } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse, NextRequest } from 'next/server'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true
})

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const { pathname } = req.nextUrl

    // Skip middleware for static files, API routes, and Next.js internals
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico'
    ) {
      return NextResponse.next()
    }

    // Check if the pathname starts with a locale
    const pathnameHasLocale = routing.locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // For requests without locale or root path, use intl middleware for redirection
    if (!pathnameHasLocale || pathname === '/') {
      try {
        return intlMiddleware(req)
      } catch (error) {
        console.error('Intl middleware error:', error)
        // Fallback: redirect to default locale
        const url = new URL(`/${routing.defaultLocale}${pathname === '/' ? '' : pathname}`, req.url)
        return NextResponse.redirect(url)
      }
    }

    // Extract locale from pathname
    const locale = pathname.split('/')[1] || routing.defaultLocale

    // Check if this is a dashboard route that requires authentication
    const isDashboardRoute = pathname.startsWith(`/${locale}/dashboard`)

    if (isDashboardRoute) {
      try {
        // Get user authentication info
        const { userId, sessionClaims } = await auth()
        
        // If user is not authenticated, redirect to sign-in
        if (!userId) {
          const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url)
          return NextResponse.redirect(signInUrl)
        }

        // Optional: Check if user has admin role (only if you need role-based access)
        // Uncomment the following lines if you want to restrict dashboard to admin users only
        /*
        const userRole = (sessionClaims?.metadata as any)?.role || (sessionClaims?.publicMetadata as any)?.role
        
        if (userRole !== 'admin') {
          // Redirect non-admin users to the main user area
          const userAreaUrl = new URL(`/${locale}`, req.url)
          return NextResponse.redirect(userAreaUrl)
        }
        */
      } catch (authError) {
        console.error('Auth middleware error:', authError)
        // Fallback: redirect to sign-in on auth errors
        const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url)
        return NextResponse.redirect(signInUrl)
      }
    }

    // For all other requests, continue normally
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Fallback: redirect to default locale home page
    const fallbackUrl = new URL(`/${routing.defaultLocale}`, req.url)
    return NextResponse.redirect(fallbackUrl)
  }
})

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - static files (images, styles, etc.)
    // - _next internals
    // - monitoring routes (Sentry)
    '/((?!api|_next/static|_next/image|favicon.ico|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'
  ]
}
