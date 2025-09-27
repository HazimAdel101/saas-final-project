'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface InitialLoaderProps {
  className?: string
}

export default function InitialLoader({ className }: InitialLoaderProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide loader after a minimum time to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Add a small delay before hiding to allow for smooth fade out
      setTimeout(() => setIsVisible(false), 300)
    }, 1000) // Minimum 1 second loading time

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-300 initial-loader',
        !isLoading && 'opacity-0',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Main spinner */}
        <div className="relative initial-loader-spinner">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-primary/20"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Digital Market
          </h2>
          <p className="text-sm text-muted-foreground">
            Loading your experience...
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full initial-loader-progress"></div>
        </div>
      </div>
    </div>
  )
}

// Alternative minimal loader for faster loading
export function MinimalInitialLoader({ className }: InitialLoaderProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 500) // Faster loading for minimal version

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-200',
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary"></div>
    </div>
  )
}
