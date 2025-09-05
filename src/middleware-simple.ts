// Alternative simple middleware - use this if the main middleware still fails
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/en/dashboard(.*)', 
  '/ar/dashboard(.*)'
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const { pathname } = req.nextUrl
    
    // Skip middleware for static files and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico' ||
      pathname.startsWith('/monitoring')
    ) {
      return NextResponse.next()
    }

    // Handle locale redirection for root path
    if (pathname === '/') {
      const url = new URL('/en', req.url)
      return NextResponse.redirect(url)
    }

    // Protect dashboard routes
    if (isProtectedRoute(req)) {
      try {
        await auth.protect()
      } catch (error) {
        console.error('Auth protection error:', error)
        // Redirect to sign-in on authentication failure
        const locale = pathname.startsWith('/ar') ? 'ar' : 'en'
        const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url)
        return NextResponse.redirect(signInUrl)
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Simple middleware error:', error)
    // Fallback to English homepage
    const fallbackUrl = new URL('/en', req.url)
    return NextResponse.redirect(fallbackUrl)
  }
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'
  ]
}
