import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export interface ProductCardProps {
  name: string
  image: string
  isPremium?: boolean
  originalPrice: string
  discountedPrice: string
  savings?: string
  description: string
}

export default function ProductCard({
  name,
  image,
  isPremium = false,
  originalPrice,
  discountedPrice,
  savings,
  description
}: ProductCardProps) {
  const t = useTranslations('ProductCard')
  return (
    <Card className='h-full w-full max-w-sm justify-between gap-2 overflow-hidden'>
      <CardHeader className='p-0'>
        <div className='relative'>
          <Image
            src={image}
            alt={name}
            width={300}
            height={200}
            className='h-48 w-full object-cover'
          />
          {isPremium && (
            <Badge className='absolute top-2 left-2 bg-blue-500'>
              {t('premium')}
            </Badge>
          )}
          <Button
            size='icon'
            variant='ghost'
            className='absolute top-2 right-2 bg-white/80 hover:bg-white'
          >
            <Heart className='h-4 w-4' />
          </Button>
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
        {savings && (
          <div className='mt-1 text-xs text-green-600'>{savings}</div>
        )}
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button className='w-full'>
          <ShoppingCart className='mr-2 h-4 w-4' />
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  )
}
