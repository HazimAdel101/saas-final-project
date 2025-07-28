'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'
import { ProductTabs } from '@/components/product.tabs'

type Language = {
  id: number
  name: string
  code: string
}

type ProductDetail = {
  id: number
  name: string
  description: string
  features: any
  language_id: number
  company?: string
  language: Language
}

type Product = {
  id: number
  price_usd: number
  price_ksa: number
  discount_usd: number
  discount_ksa: number
  image_url: string
  productDetails: ProductDetail[]
}

export default function ProductDetailsClient({
  product
}: {
  product: Product
}) {
  const t = useTranslations('ProductDetails')
  const saving = product.price_usd - product.discount_usd
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
          <h1>{product.productDetails?.[0]?.name}</h1>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className='inline-block h-5 w-5 text-yellow-500' />
          ))}
          <div className='mt-2 flex items-center gap-2'>
            <span className='text-lg font-semibold text-gray-900'>
              {product.discount_usd}
            </span>
            <span className='text-sm text-gray-500 line-through'>
              {product.price_usd}
            </span>
            <span className='ml-2 text-xs text-green-600'>
              Save {saving} USD
            </span>
          </div>
          <Separator />
          <table className='border-separate border-spacing-2'>
            <tbody>
              <tr>
                <td>{t('brand')}</td>
                <td>{product.productDetails?.[0]?.company}</td>
              </tr>
              <tr>
                <td>{t('tags')}</td>
                <td>{product.productDetails?.[0]?.company}</td>
              </tr>
              <tr>
                <td>{t('categories')}</td>
                <td>{product.productDetails?.[0]?.company}</td>
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
      <ProductTabs description={product.productDetails?.[0]?.description} />
    </>
  )
}
