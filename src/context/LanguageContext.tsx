import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export type Language = 'en' | 'ar'

interface LanguageContextProps {
  language: Language
  direction: 'ltr' | 'rtl'
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [language, setLanguageState] = useState<Language>('en')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Extract current locale from pathname
    const currentLocale = pathname.split('/')[1] as Language
    if (currentLocale === 'en' || currentLocale === 'ar') {
      setLanguageState(currentLocale)
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', currentLocale)
      }
    }
  }, [pathname])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }

    // Redirect to the new locale while preserving the current path
    const segments = pathname.split('/')
    segments[1] = lang // Replace the locale segment
    const newPath = segments.join('/')
    router.push(newPath)
  }

  const direction = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
