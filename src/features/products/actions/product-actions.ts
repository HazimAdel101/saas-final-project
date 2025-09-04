'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Creates a new Product and nested ProductDetail based on submitted form data.
 */
export interface NewProductInput {
  name: string
  description: string
  languageId: number
  price: number
  imageUrl: string
  company?: string | null
}
export async function addProduct(input: NewProductInput) {
  // Determine which currency field to populate based on language code
  const lang = await prisma.language.findUnique({
    where: { id: input.languageId }
  })
  const isEnglish = lang?.code === 'en'
  // First create the Product record
  const product = await prisma.product.create({
    data: {
      price_usd: isEnglish ? input.price : 0,
      price_ksa: isEnglish ? 0 : input.price,
      discount_usd: 0,
      discount_ksa: 0,
      image_url: input.imageUrl
    }
  })
  // Then create ProductDetail linked to the product
  await prisma.productDetail.create({
    data: {
      product_id: product.id,
      name: input.name,
      description: input.description,
      features: {},
      language_id: input.languageId
    }
  })
  revalidatePath('/dashboard/products')
  return product
}
