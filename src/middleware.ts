import { clerkMiddleware } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true // Enable automatic detection
})

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl

  // Check if the pathname starts with a locale
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // For requests without locale or root path, use intl middleware for redirection
  if (!pathnameHasLocale || pathname === '/') {
    return intlMiddleware(req)
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
