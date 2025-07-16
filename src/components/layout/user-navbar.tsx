'use client'

import InfoMenu from '@/components/info-menu'
import NotificationMenu from '@/components/notification-menu'
import UserMenu from '@/components/user-menu'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import ThemeTogglePopover from '@/components/layout/ThemeTogglePopover'
import { useLanguage } from '@/context/LanguageContext'

export default function Navbar() {
  const { language, setLanguage } = useLanguage()
  // Change language and update URL
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any)
    // Change the locale in the URL (assumes /[locale]/... structure)
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean)
      if (
        pathParts.length > 0 &&
        (pathParts[0] === 'en' || pathParts[0] === 'ar')
      ) {
        pathParts[0] = lang
      } else {
        pathParts.unshift(lang)
      }
      const newPath =
        '/' +
        pathParts.join('/') +
        window.location.search +
        window.location.hash
      window.location.assign(newPath)
    }
  }
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ]
  return (
    <header className='fixed top-0 right-0 z-[999] w-full border-b px-4 md:px-6'>
      <div className='flex h-16 items-center justify-between gap-4 bg-amber-700'>
        {/* Left side: Mobile menu and logo */}
        <div className='flex items-center gap-2'>
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className='group size-8 md:hidden'
                variant='ghost'
                size='icon'
              >
                <svg
                  className='pointer-events-none'
                  width={16}
                  height={16}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M4 12L20 12'
                    className='origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]'
                  />
                  <path
                    d='M4 12H20'
                    className='origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45'
                  />
                  <path
                    d='M4 12H20'
                    className='origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]'
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='w-36 p-1 md:hidden'>
              {/* <NavigationMenu className='max-w-none *:w-full'>
                <NavigationMenuList className='flex-col items-start gap-0 md:gap-2'>
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className='w-full'>
                      <NavigationMenuLink href={link.href} className='py-1.5'>
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu> */}
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <a href='#' className='text-primary hover:text-primary/90 ml-2'>
            logo
          </a>
        </div>

        {/* Center: Search bar */}
        <div className='flex flex-1 justify-center'>
          <div className='w-full max-w-md'>
            <input
              type='text'
              placeholder='Search...'
              className='border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-1.5 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
        </div>

        {/* Right side: Desktop nav and user actions */}
        <div className='flex items-center gap-4'>
          {/* Desktop navigation menu */}
          {/* <NavigationMenu className='max-md:hidden'>
            <NavigationMenuList className='gap-2'>
              {navigationLinks.map((link, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink
              href={link.href}
              className='text-muted-foreground hover:text-primary py-1.5 font-medium'
            >
              {link.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu> */}
          {/* Change Language Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='ghost' size='icon' aria-label='Change language'>
                <svg
                  width='20'
                  height='20'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <circle cx='12' cy='12' r='10' />
                  <path d='M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20' />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-32 p-2'>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1 text-left ${language === lang.code ? 'bg-muted font-bold' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  aria-current={language === lang.code ? 'true' : undefined}
                >
                  {lang.label}
                  {language === lang.code && (
                    <span className='text-primary ml-auto text-xs'>✓</span>
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          {/* Change Theme Button */}
          <ThemeTogglePopover />
          {/* Info menu */}
          <InfoMenu />
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
