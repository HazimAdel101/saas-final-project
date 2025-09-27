'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface EnhancedLoadingProps {
  className?: string
  variant?: 'default' | 'minimal' | 'splash'
  message?: string
  showProgress?: boolean
  duration?: number
}

export default function EnhancedLoading({
  className,
  variant = 'default',
  message = 'Loading your experience...',
  showProgress = true,
  duration = 1000
}: EnhancedLoadingProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 100)

    // Complete loading after duration
    const timer = setTimeout(() => {
      setProgress(100)
      setIsLoading(false)
      setTimeout(() => setIsVisible(false), 300)
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [duration])

  if (!isVisible) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'splash':
        return 'h-20 w-20'
      default:
        return 'h-16 w-16'
    }
  }

  const getContainerStyles = () => {
    switch (variant) {
      case 'splash':
        return 'space-y-6'
      default:
        return 'space-y-4'
    }
  }

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-200',
          !isLoading && 'opacity-0',
          className
        )}
      >
        <div className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', getVariantStyles())}></div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-300 initial-loader',
        !isLoading && 'opacity-0',
        className
      )}
    >
      <div className={cn('flex flex-col items-center', getContainerStyles())}>
        {/* Main spinner */}
        <div className="relative initial-loader-spinner">
          <div className={cn('animate-spin rounded-full border-4 border-muted border-t-primary', getVariantStyles())}></div>
          <div className={cn('absolute inset-0 animate-ping rounded-full border-4 border-primary/20', getVariantStyles())}></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h2 className={cn(
            'font-semibold text-foreground mb-2',
            variant === 'splash' ? 'text-2xl' : 'text-xl'
          )}>
            Digital Market
          </h2>
          <p className={cn(
            'text-muted-foreground',
            variant === 'splash' ? 'text-base' : 'text-sm'
          )}>
            {message}
          </p>
        </div>
        
        {/* Progress bar */}
        {showProgress && (
          <div className={cn(
            'bg-muted rounded-full overflow-hidden',
            variant === 'splash' ? 'w-64 h-2' : 'w-48 h-1'
          )}>
            <div 
              className={cn(
                'h-full bg-primary rounded-full transition-all duration-300 ease-out',
                variant === 'splash' ? 'initial-loader-progress' : ''
              )}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
