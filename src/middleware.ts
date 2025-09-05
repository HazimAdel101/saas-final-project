import { clerkMiddleware } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true // Enable automatic detection
})

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // Check if the pathname starts with a locale
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // For requests without locale or root path, use intl middleware for redirection
  if (!pathnameHasLocale || pathname === '/') {
    return intlMiddleware(req)
  }

  // Check if this is a dashboard route that requires admin access
  const isDashboardRoute = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/dashboard`)
  )

  if (isDashboardRoute) {
    // Get user authentication info
    const { userId, sessionClaims } = await auth()
    
    // If user is not authenticated, redirect to sign-in
    if (!userId) {
      const locale = pathname.split('/')[1] || routing.defaultLocale
      const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Check if user has admin role in public metadata
    const userRole = (sessionClaims?.metadata as any)?.role || (sessionClaims?.publicMetadata as any)?.role
    
    if (userRole !== 'admin') {
      // Redirect non-admin users to the main user area
      const locale = pathname.split('/')[1] || routing.defaultLocale
      const userAreaUrl = new URL(`/${locale}`, req.url)
      return NextResponse.redirect(userAreaUrl)
    }
  }

  // For requests with locale prefix, continue with clerk middleware
  return
})

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - static files (images, styles, etc.)
    // - _next internals
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
