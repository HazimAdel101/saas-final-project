'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useInitialLoading } from '@/hooks/use-initial-loading'
import EnhancedLoading from '@/components/enhanced-loading'

interface LoadingContextType {
  isInitialLoading: boolean
  isHydrated: boolean
  setIsInitialLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
  showLoader?: boolean
  loaderType?: 'full' | 'minimal' | 'splash'
  loadingMessage?: string
  loadingDuration?: number
}

export default function LoadingProvider({ 
  children, 
  showLoader = true,
  loaderType = 'full',
  loadingMessage = 'Loading your experience...',
  loadingDuration = 1000
}: LoadingProviderProps) {
  const loadingState = useInitialLoading()

  return (
    <LoadingContext.Provider value={loadingState}>
      {showLoader && loadingState.isInitialLoading && (
        <EnhancedLoading
          variant={loaderType}
          message={loadingMessage}
          duration={loadingDuration}
        />
      )}
      {children}
    </LoadingContext.Provider>
  )
}
