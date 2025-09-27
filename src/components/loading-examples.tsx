'use client'

import EnhancedLoading from '@/components/enhanced-loading'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Example component showing different loading variants
export default function LoadingExamples() {
  const [showLoader, setShowLoader] = useState(false)
  const [loaderType, setLoaderType] = useState<'default' | 'minimal' | 'splash'>('default')

  const triggerLoader = (type: 'default' | 'minimal' | 'splash') => {
    setLoaderType(type)
    setShowLoader(true)
    
    // Auto-hide after 3 seconds
    setTimeout(() => setShowLoader(false), 3000)
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Loading Examples</h1>
      
      <div className="space-x-2">
        <Button onClick={() => triggerLoader('default')}>
          Show Default Loader
        </Button>
        <Button onClick={() => triggerLoader('minimal')}>
          Show Minimal Loader
        </Button>
        <Button onClick={() => triggerLoader('splash')}>
          Show Splash Loader
        </Button>
      </div>

      {showLoader && (
        <EnhancedLoading
          variant={loaderType}
          message="Loading example..."
          duration={3000}
        />
      )}
    </div>
  )
}

// Usage examples for different scenarios
export const LoadingUsageExamples = {
  // For initial app loading
  initialAppLoading: () => (
    <EnhancedLoading
      variant="splash"
      message="Welcome to Digital Market"
      duration={2000}
    />
  ),

  // For page transitions
  pageTransition: () => (
    <EnhancedLoading
      variant="default"
      message="Loading page..."
      duration={1000}
    />
  ),

  // For quick operations
  quickLoading: () => (
    <EnhancedLoading
      variant="minimal"
      duration={500}
    />
  ),

  // For data fetching
  dataLoading: () => (
    <EnhancedLoading
      variant="default"
      message="Fetching your data..."
      showProgress={true}
      duration={1500}
    />
  )
}
