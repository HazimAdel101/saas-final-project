import { notFound } from 'next/navigation'
import ProductDetailsClient from '@/components/ProductDetailsClient'
import { PrismaClient } from '@prisma/client'

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  return (
    <div className='mt-16'>
      <ProductDetailsClient
        product={{
          ...product,
          price_usd:
            product.price_usd instanceof Object &&
            'toNumber' in product.price_usd
              ? product.price_usd.toNumber()
              : Number(product.price_usd),
          price_ksa:
            product.price_ksa instanceof Object &&
            'toNumber' in product.price_ksa
              ? product.price_ksa.toNumber()
              : Number(product.price_ksa),
          discount_usd:
            product.discount_usd instanceof Object &&
            'toNumber' in product.discount_usd
              ? product.discount_usd.toNumber()
              : Number(product.discount_usd),
          discount_ksa:
            product.discount_ksa instanceof Object &&
            'toNumber' in product.discount_ksa
              ? product.discount_ksa.toNumber()
              : Number(product.discount_ksa)
        }}
      />
    </div>
  )
}
