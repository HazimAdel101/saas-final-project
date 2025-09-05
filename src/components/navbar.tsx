import { Star } from 'lucide-react'
import { Button } from './ui/button'

export default function Navbar() {
  return (
    <nav className='sticky top-0 z-50 bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex items-center space-x-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600'>
                <Star className='h-5 w-5 text-white' />
              </div>
              <span className='text-xl font-bold text-gray-900'>
                ExclusiveServices
              </span>
            </div>
          </div>
          <div className='hidden items-center space-x-8 md:flex'>
            <a
              href='#services'
              className='text-gray-700 transition-colors hover:text-blue-600'
            >
              Services
            </a>
            <a
              href='#about'
              className='text-gray-700 transition-colors hover:text-blue-600'
            >
              About
            </a>
            <a
              href='#contact'
              className='text-gray-700 transition-colors hover:text-blue-600'
            >
              Contact
            </a>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
