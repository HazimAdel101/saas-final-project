import { clerkMiddleware } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: false // Disable automatic detection, we'll handle it manually
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle root path - let our server-side page handle language detection
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Check if the pathname starts with a locale
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If no locale in pathname, redirect to default locale
  if (!pathnameHasLocale && pathname !== '/') {
    // Try to detect locale from Accept-Language header for first-time visitors
    const acceptLanguage = request.headers.get('accept-language') || ''
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
    
    const detectedLocale = languages.some(lang => 
      lang.startsWith('ar') || lang.includes('ar')
    ) ? 'ar' : routing.defaultLocale

    const redirectUrl = new URL(`/${detectedLocale}${pathname}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // For requests with locale prefix, run both intl and clerk middleware
  if (pathnameHasLocale) {
    // Run the clerk middleware for protected routes
    return clerkMiddleware()(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - static files (images, styles, etc.)
    // - _next internals
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
