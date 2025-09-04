'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function LocaleRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're in a locale-specific path
    const isLocaleSpecific = pathname.startsWith('/en') || pathname.startsWith('/ar')
    
    if (isLocaleSpecific) {
      // Extract current locale and save it
      const currentLocale = pathname.split('/')[1] as 'en' | 'ar'
      localStorage.setItem('language', currentLocale)
    }
  }, [pathname])

  return null // This component doesn't render anything
}
