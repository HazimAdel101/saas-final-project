'use client'

import { useEffect, useState } from 'react'

export function useInitialLoading() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated when component mounts
    setIsHydrated(true)
    
    // Set a minimum loading time to ensure smooth UX
    const minLoadingTime = 800
    const startTime = Date.now()
    
    const checkLoadingComplete = () => {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadingTime - elapsed)
      
      setTimeout(() => {
        setIsInitialLoading(false)
      }, remainingTime)
    }

    // Check if page is fully loaded
    if (document.readyState === 'complete') {
      checkLoadingComplete()
    } else {
      window.addEventListener('load', checkLoadingComplete)
      return () => window.removeEventListener('load', checkLoadingComplete)
    }
  }, [])

  return {
    isInitialLoading,
    isHydrated,
    setIsInitialLoading
  }
}
