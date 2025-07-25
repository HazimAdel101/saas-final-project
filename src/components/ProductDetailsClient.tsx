'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'
import { ProductTabs } from '@/components/product.tabs'

interface Service {
  id: string
  name: string
  icon: React.ReactNode
  company: string
  usedBy: string
  category: string
  isPremium: boolean
  originalPrice: string
  discountedPrice: string
  savings: string
  description: string
  longDescription: string
  features: string[]
  benefits: string[]
  terms?: string
  deliveryTime: string
  rating: number
  reviews: number
}

interface ProductDetailsClientProps {
  service: Service
}

export default function ProductDetailsClient({
  service
}: ProductDetailsClientProps) {
  const t = useTranslations('ProductDetails')
  return (
    <>
      <div className='flex justify-center gap-6 pt-6'>
        <div className=''>
          <Image
            src='/products/chatgpt.jpeg'
            alt='Example image'
            width={400}
            height={400}
            className='size-[400px] rounded-2xl shadow-md'
          />
        </div>
        <div className=''>
          <h1>{service.name}</h1>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className='inline-block h-5 w-5 text-yellow-500' />
          ))}
          <div className='mt-2 flex items-center gap-2'>
            <span className='text-lg font-semibold text-gray-900'>
              {service.discountedPrice}
            </span>
            <span className='text-sm text-gray-500 line-through'>
              {service.originalPrice}
            </span>
            <span className='ml-2 text-xs text-green-600'>
              Save {service.savings}
            </span>
          </div>
          <Separator />
          <table className='border-separate border-spacing-2'>
            <tbody>
              <tr>
                <td>{t('brand')}</td>
                <td>{service.company}</td>
              </tr>
              <tr>
                <td>{t('tags')}</td>
                <td>{service.company}</td>
              </tr>
              <tr>
                <td>{t('categories')}</td>
                <td>{service.category}</td>
              </tr>
            </tbody>
          </table>
          <Separator />
          <ul className=''>
            <li>{t('officialActivation')}</li>
            <li>{t('goldenWarranty')}</li>
            <li>{t('instantActivation')}</li>
          </ul>
        </div>
      </div>
      <ProductTabs description={service.description} />
    </>
  )
}
