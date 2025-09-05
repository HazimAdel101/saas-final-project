import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Configure middleware to run on Edge Runtime (required for Vercel)
export const runtime = 'experimental-edge'

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/en/dashboard(.*)', 
  '/ar/dashboard(.*)'
])

// Define the locales
const locales = ['en', 'ar']
const defaultLocale = 'en'

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/monitoring') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Handle root path redirection to default locale
  if (pathname === '/') {
    const url = new URL(`/${defaultLocale}`, req.url)
    return NextResponse.redirect(url)
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If no locale in pathname, redirect to default locale
  if (!pathnameHasLocale) {
    const url = new URL(`/${defaultLocale}${pathname}`, req.url)
    return NextResponse.redirect(url)
  }

  // Handle authentication for protected routes
  if (isProtectedRoute(req)) {
    try {
      const { userId } = await auth()
      
      if (!userId) {
        // Extract locale from pathname
        const locale = pathname.split('/')[1] || defaultLocale 
        const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url)
        return NextResponse.redirect(signInUrl)
      }
    } catch (error) {
      // Extract locale from pathname for error fallback
      const locale = pathname.split('/')[1] || defaultLocale
      const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
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
