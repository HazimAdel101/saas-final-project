'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface CartButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function CartButton({
  variant = 'outline',
  size = 'icon',
  className = ''
}: CartButtonProps) {
  const { getTotalItems } = useCartStore()
  const [isClient, setIsClient] = useState(false)
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalItems = isClient ? getTotalItems() : 0

  return (
    <Link href={`/${locale}/cart`}>
      <Button
        variant={variant}
        size={size}
        className={`relative ${className}`}
      >
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
  )
}
