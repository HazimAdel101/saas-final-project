import { Star } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

'use client'

export default function Navbar() {
  const { getTotalItems } = useCartStore()
  const [isClient, setIsClient] = useState(false)
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalItems = isClient ? getTotalItems() : 0

  return (
    <nav className='sticky top-0 z-50 bg-white border-b'>
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
            <Link href={`/${locale}/cart`}>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
