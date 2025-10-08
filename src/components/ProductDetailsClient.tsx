'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'
import { ProductTabs } from '@/components/product.tabs'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { getColorWithOpacity, getFullColor } from '@/lib/utils'

type Language = {
  id: number
  name: string
  code: string
}

type ServiceDetail = {
  id: number
  name: string
  description: string
  features: any
  language_id: number
  company?: string
  language: Language
}

type Brand = {
  id: number
  name: string
  color: string
}

type CategoryTranslation = {
  id: number
  name: string
}

type Category = {
  id: number
  color: string
  translations: CategoryTranslation[]
}

type ServiceCategory = {
  id: number
  category: Category
}

type TagTranslation = {
  id: number
  name: string
}

type Tag = {
  id: number
  color: string
  translations: TagTranslation[]
}

type ServiceTag = {
  id: number
  tag: Tag
}

type Product = {
  id: number
  price_usd: number
  price_ksa: number
  discount_usd: number
  discount_ksa: number
  image_url: string
  ServiceDetails: ServiceDetail[]
  brand: Brand | null
  categories: ServiceCategory[]
  tags: ServiceTag[]
}

export default function ProductDetailsClient({
  product,
  locale
}: {
  product: Product
  locale: string
}) {
  const t = useTranslations('ProductDetails')
  const language = locale
  const index = language === 'en' ? 0 : 1
  let saving = 0
  if (language === 'ar')
    saving = Number(product.price_ksa) - Number(product.discount_ksa)
  else saving = Number(product.price_usd) - Number(product.discount_usd)

  return (
    <>
      <div className='flex justify-center gap-6 pt-6'>
        <div className=''>
          <Image
            src={product.image_url}
            alt='Example image'
            width={400}
            height={400}
            className='size-[400px] rounded-2xl shadow-md'
          />
        </div>
        <div className='flex min-h-[400px] flex-col justify-between'>
          <h1>{product.ServiceDetails?.[index]?.name}</h1>
          <span>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className='inline-block h-5 w-5 text-warning-500' />
            ))}
          </span>
          <div className='mt-2 flex items-center gap-2'>
            <span className='text-lg font-semibold text-foreground'>
              {language === 'ar'
                ? product.discount_ksa.toString() + ' SAR'
                : product.discount_usd.toString() + ' USD'}
            </span>
            <span className='text-sm text-muted-foreground line-through'>
              {language === 'ar'
                ? product.price_ksa.toString() + ' SAR'
                : product.price_usd.toString() + ' USD'}
            </span>
            <span className='ml-2 text-xs text-success-600'>
              Save {saving.toString()} {language === 'ar' ? 'SAR' : 'USD'}!
            </span>
          </div>
          <Separator />
          <table className='border-separate border-spacing-2'>
            <tbody>
              <tr>
                <td className='font-medium'>{t('brand')}</td>
                <td>
                  {product.brand ? (
                    <Badge 
                      variant="secondary" 
                      style={{ 
                        backgroundColor: getColorWithOpacity(product.brand.color),
                        color: getFullColor(product.brand.color)
                      }}
                    >
                      {product.brand.name}
                    </Badge>
                  ) : (
                    <span className='text-muted-foreground'>{t('noBrand')}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className='font-medium'>{t('tags')}</td>
                <td>
                  {product.tags.length > 0 ? (
                    <div className='flex flex-wrap gap-1'>
                      {product.tags.map((serviceTag) => (
                        <Badge 
                          key={serviceTag.id} 
                          variant="secondary"
                          style={{ 
                            backgroundColor: getColorWithOpacity(serviceTag.tag.color),
                            color: getFullColor(serviceTag.tag.color)
                          }}
                        >
                          {serviceTag.tag.translations[0]?.name || 'Untitled Tag'}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>{t('noTags')}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className='font-medium'>{t('categories')}</td>
                <td>
                  {product.categories.length > 0 ? (
                    <div className='flex flex-wrap gap-1'>
                      {product.categories.map((serviceCategory) => (
                        <Badge 
                          key={serviceCategory.id} 
                          variant="secondary"
                          style={{ 
                            backgroundColor: getColorWithOpacity(serviceCategory.category.color),
                            color: getFullColor(serviceCategory.category.color)
                          }}
                        >
                          {serviceCategory.category.translations[0]?.name || 'Untitled Category'}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>{t('noCategories')}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <Separator />
          <ul className=''>
            <li>{t('officialActivation')}</li>
            <li>{t('goldenWarranty')}</li>
            <li>{t('instantActivation')}</li>
          </ul>

          <Button className='mt-4 w-full'>{t('buyNow')}</Button>
        </div>
      </div>
      <ProductTabs description={product.ServiceDetails?.[1]?.description} />
    </>
  )
}
