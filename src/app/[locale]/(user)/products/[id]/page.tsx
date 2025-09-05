import { notFound } from 'next/navigation'
import ProductDetailsClient from '@/components/ProductDetailsClient'
import { PrismaClient } from '@prisma/client'

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const prisma = new PrismaClient()
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      productDetails: {
        include: {
          language: true
        }
      }
    }
  })
  if (!product) {
    notFound()
  }

  // Transform the product data to match the expected type
  const transformedProduct = {
    ...product,
    price_usd: Number(product.price_usd),
    price_ksa: Number(product.price_ksa),
    discount_usd: Number(product.discount_usd),
    discount_ksa: Number(product.discount_ksa),
    productDetails: product.productDetails.map(detail => ({
      ...detail,
      company: detail.company || undefined
    }))
  }

  return (
    <div className='mt-16'>
      <ProductDetailsClient
        locale={locale}
        product={transformedProduct}
      />
    </div>
  )
}
