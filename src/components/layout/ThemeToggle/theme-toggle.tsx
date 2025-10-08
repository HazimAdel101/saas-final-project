'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark'
      const root = document.documentElement

      if (!document.startViewTransition) {
        setTheme(newMode)
        return
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`)
        root.style.setProperty('--y', `${e.clientY}px`)
      }

      document.startViewTransition(() => {
        setTheme(newMode)
      })
    },
    [resolvedTheme, setTheme]
  )

  // Show sun icon in light mode (click to go to dark), moon icon in dark mode (click to go to light)
  const IconComponent = resolvedTheme === 'dark' ? Icons.moon : Icons.sun

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8'
      onClick={handleThemeToggle}
    >
      <IconComponent />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
