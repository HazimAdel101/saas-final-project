import InfoMenu from '@/components/info-menu'
import NotificationMenu from '@/components/notification-menu'
import UserMenu from '@/components/user-menu'
import { Button } from '@/components/ui/button'
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList
// } from '@/components/ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import ThemeTogglePopover from '@/components/layout/ThemeTogglePopover'

// Navigation links array to be used in both desktop and mobile menus
// ...existing code...

export default function Navbar() {
  return (
    <header className='border-b px-4 md:px-6'>
      <div className='flex h-16 items-center justify-between gap-4'>
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
              <button className='hover:bg-muted w-full rounded px-2 py-1 text-left'>
                English
              </button>
              <button className='hover:bg-muted w-full rounded px-2 py-1 text-left'>
                Español
              </button>
              <button className='hover:bg-muted w-full rounded px-2 py-1 text-left'>
                Français
              </button>
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
