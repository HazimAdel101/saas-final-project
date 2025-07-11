import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

function composeMiddleware(...middlewares: any[]) {
  return async (req: NextRequest) => {
    let res;
    for (const middleware of middlewares) {
      res = await middleware(req, res);
      if (res) return res;
    }
    return res;
  };
}

const protectedClerkMiddleware = clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export default composeMiddleware(intlMiddleware, protectedClerkMiddleware);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
