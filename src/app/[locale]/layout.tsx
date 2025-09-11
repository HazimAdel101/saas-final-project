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
