import React, { createContext, useContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    const storedLang =
      typeof window !== 'undefined' ? localStorage.getItem('language') : null
    if (storedLang === 'en' || storedLang === 'ar') {
      setLanguageState(storedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
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
