'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/stores/cart-store'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export interface ProductCardProps {
  id: number
  name: string
  image: string
  isPremium?: boolean
  originalPrice: string
  discountedPrice: string
  savings?: string
  description: string
  price: number
}

export default function ProductCard({
  id,
  name,
  image,
  isPremium = false,
  originalPrice,
  discountedPrice,
  savings,
  description,
  price
}: ProductCardProps) {
  const t = useTranslations('ProductCard')
  const params = useParams()
  const locale = params.locale as string
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image_url: image,
      description
    })
  }

  return (
    <Card className='size-full max-w-sm justify-between gap-2 overflow-hidden'>
      <CardHeader className='p-0'>
        <div className='relative'>
          {image ? (
            <Image
              src={image}
              alt={name}
              width={300}
              height={200}
              className='h-48 w-full object-cover'
            />
          ) : (
            <Image
              src={'/logo.svg'}
              alt={name}
              width={300}
              height={200}
              className='h-48 w-full object-cover'
            />
          )}
          {isPremium && (
            <Badge className='bg-primary text-primary-foreground absolute top-2 left-2'>
              {t('premium')}
            </Badge>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <Link href={`/${locale}/products/${id}`}>
              <Button
                size='icon'
                variant='ghost'
                className='bg-secondary/80 hover:bg-secondary'
              >
                <Eye className='h-4 w-4' />
              </Button>
            </Link>
            <Button
              size='icon'
              variant='ghost'
              className='bg-secondary/80 hover:bg-secondary'
            >
              <Heart className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='h-full px-4'>
        <h3 className='mb-2 text-lg font-semibold'>{name}</h3>
        <p className='text-muted-foreground mb-3 text-sm'>{description}</p>
        <div className='flex items-center gap-2'>
          <span className='text-2xl font-bold'>{discountedPrice}</span>
          <span className='text-muted-foreground text-sm line-through'>
            {originalPrice}
          </span>
        </div>
        {savings && <div className='text-primary mt-1 text-xs'>{savings}</div>}
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button onClick={handleAddToCart} className='w-full'>
          <ShoppingCart className='mr-2 h-4 w-4' />
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  )
}
