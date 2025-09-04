'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function LocaleRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if we're on the root path
    if (pathname !== '/') return

    // Check for saved language preference
    const savedLocale = localStorage.getItem('language')
    
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
      // Redirect to saved preference
      router.replace(`/${savedLocale}`)
    }
  }, [router, pathname])

  return null // This component doesn't render anything
}
