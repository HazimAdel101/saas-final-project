import clerk from './clerk-middleware';
import intl from './intl-middleware';
import { NextFetchEvent, NextRequest } from 'next/server';

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // First run next-intl middleware for locale detection
  const intlResponse = intl(req);
  // Then run Clerk middleware for authentication
  const clerkResponse = clerk(req, event);

  // If either middleware returns a response, return it
  return intlResponse || clerkResponse;
}

export const config = {
  matcher: [
    // next-intl: match locale-prefixed routes
    '/(en|ar)/:path*',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
