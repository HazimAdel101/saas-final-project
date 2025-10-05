'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to handle hydration issues caused by browser extensions
 * and other client-side modifications to the DOM
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated after the first render
    setIsHydrated(true)

    // Clean up browser extension attributes that cause hydration mismatches
    const cleanup = () => {
      const elements = document.querySelectorAll('*')
      elements.forEach((element) => {
        // Remove common browser extension attributes
        const attributesToRemove = [
          'bis_skin_checked',
          'bis_register',
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed',
          'data-grammarly-shadow-root',
          'data-1password-ignore',
          'data-lastpass-icon-root',
          'data-bitwarden-watching',
          'data-dashlane-rid'
        ]
        
        attributesToRemove.forEach(attr => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr)
          }
        })

        // Remove any attribute that starts with __processed_ or bis_
        Array.from(element.attributes).forEach(attr => {
          if (attr.name.startsWith('__processed_') || attr.name.startsWith('bis_')) {
            element.removeAttribute(attr.name)
          }
        })
      })
    }

    // Run cleanup after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(cleanup, 50)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return isHydrated
}
