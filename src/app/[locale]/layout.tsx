import Providers from '@/components/layout/providers'
import { Toaster } from '@/components/ui/sonner'
import { fontVariables } from '@/lib/font'
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import LocaleRedirect from '@/components/locale-redirect'
import { CartHydration } from '@/components/cart/cart-hydration'
import HydrationErrorBoundary from '@/components/hydration-error-boundary'
import '@unocss/reset/tailwind.css'
import './globals.css'
import './theme.css'

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
}

export const metadata: Metadata = {
  title: 'Digital Market',
  description: 'Digital Market'
}

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  try {
    const cookieStore = await cookies()
    const activeThemeValue = cookieStore.get('active_theme')?.value
    const isScaled = activeThemeValue?.endsWith('-scaled')
    const { locale } = await params
    
    
    if (!locale || !hasLocale(routing.locales, locale)) {
      notFound()
    }
    const direction = locale === 'ar' ? 'rtl' : 'ltr'
    const messages = await getMessages({ locale })
    return (
      <html lang={locale} dir={direction} suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                  }
                } catch (_) {}
                
                // Fix React DevTools hook initialization
                if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on !== 'function') {
                    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on = function() {};
                  }
                }
                
                // Clean up browser extension attributes that cause hydration mismatches
                (function() {
                  const cleanup = () => {
                    const elements = document.querySelectorAll('*');
                    elements.forEach((element) => {
                      const attributesToRemove = [
                        'bis_skin_checked',
                        'bis_register',
                        'data-new-gr-c-s-check-loaded',
                        'data-gr-ext-installed',
                        'data-grammarly-shadow-root',
                        'data-1password-ignore',
                        'data-lastpass-icon-root',
                        'data-bitwarden-watching',
                        'data-dashlane-rid',
                        'data-1password-ignore'
                      ];
                      
                      attributesToRemove.forEach(attr => {
                        if (element.hasAttribute(attr)) {
                          element.removeAttribute(attr);
                        }
                      });
                      
                      // Remove any attribute that starts with __processed_ or bis_
                      Array.from(element.attributes).forEach(attr => {
                        if (attr.name.startsWith('__processed_') || attr.name.startsWith('bis_')) {
                          element.removeAttribute(attr.name);
                        }
                      });
                    });
                  };
                  
                  // Run cleanup immediately and after DOM is ready
                  cleanup();
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', cleanup);
                  }
                  
                  // Also run cleanup on mutation observer to catch dynamically added attributes
                  if (typeof MutationObserver !== 'undefined') {
                    const observer = new MutationObserver(() => {
                      cleanup();
                    });
                    observer.observe(document.body, {
                      attributes: true,
                      childList: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked', 'bis_register', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
                    });
                  }
                })();
              `
            }}
          />
        </head>
        <body
          className={cn(
            'bg-background overflow-scroll overscroll-none font-sans antialiased',
            activeThemeValue ? `theme-${activeThemeValue}` : '',
            isScaled ? 'theme-scaled' : '',
            fontVariables
          )}
        >
          <HydrationErrorBoundary>
            <NextTopLoader showSpinner={false} />
            <LocaleRedirect />
            <NuqsAdapter>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
                enableColorScheme
              >
                <Providers activeThemeValue={activeThemeValue as string}>
                  <CartHydration />
                  <Toaster />
                  <NextIntlClientProvider messages={messages} locale={locale}>
                    {children}
                  </NextIntlClientProvider>
                </Providers>
              </ThemeProvider>
            </NuqsAdapter>
          </HydrationErrorBoundary>
        </body>
      </html>
    )
  } catch (error) {
    // Fallback to basic HTML structure
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background font-sans antialiased">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
              <p className="text-gray-600">Please try refreshing the page.</p>
            </div>
          </div>
        </body>
      </html>
    )
  }
}
