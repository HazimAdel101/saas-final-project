'use client'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export default function ThemeTogglePopover() {
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' aria-label='Change theme'>
          <svg
            width='20'
            height='20'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path d='M12 3v1M12 20v1M4.22 4.22l.7.7M18.36 18.36l.7.7M1 12h1M20 12h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7' />
            <circle cx='12' cy='12' r='5' />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end'>
        <button
          className='hover:bg-muted w-full rounded px-2 py-1 text-left'
          onClick={() => {
            setTheme('light')
            setOpen(false)
          }}
        >
          Light
        </button>
        <button
          className='hover:bg-muted w-full rounded px-2 py-1 text-left'
          onClick={() => {
            setTheme('dark')
            setOpen(false)
          }}
        >
          Dark
        </button>
        <button
          className='hover:bg-muted w-full rounded px-2 py-1 text-left'
          onClick={() => {
            setTheme('system')
            setOpen(false)
          }}
        >
          System
        </button>
      </PopoverContent>
    </Popover>
  )
}
