'use client'

export default function Footer() {
  return (
    <footer className='border-t border-gray-200 bg-white'>
      <div className='mx-auto w-full px-4 py-6 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='flex items-center space-x-6 text-sm text-gray-600'>
            <a
              href='#privacy'
              className='transition-colors hover:text-gray-900'
            >
              Privacy Policy
            </a>
            <a href='#terms' className='transition-colors hover:text-gray-900'>
              Terms of Service
            </a>
            <a
              href='#support'
              className='transition-colors hover:text-gray-900'
            >
              Support
            </a>
          </div>
          <div className='text-sm text-gray-500'>
            {new Date().getFullYear()} ExclusiveServices. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
