'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Creates a new Product and nested ProductDetail records for both languages.
 */
export interface NewProductInput {
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  price_usd: number
  price_ksa: number
  imageUrl: string
  category: string
}

export async function addProduct(input: NewProductInput) {
  try {
    // Get language records
    const languages = await prisma.language.findMany()
    const englishLang = languages.find((l) => l.code === 'en')
    const arabicLang = languages.find((l) => l.code === 'ar')

    if (!englishLang || !arabicLang) {
      throw new Error('Required languages not found in database. Please ensure English (en) and Arabic (ar) languages are seeded.')
    }

    // First create the Product record
    const product = await prisma.service.create({
      data: {
        price_usd: input.price_usd,
        price_ksa: input.price_ksa,
        discount_usd: 0,
        discount_ksa: 0,
        image_url: input.imageUrl
      }
    })

    // Create ProductDetail for English
    await prisma.serviceDetail.create({
      data: {
        service_id: product.id,
        name: input.name_en,
        description: input.description_en,
        features: JSON.stringify({ category: input.category }),
        language_id: englishLang.id
      }
    })

    // Create ProductDetail for Arabic
    await prisma.serviceDetail.create({
      data: {
        service_id: product.id,
        name: input.name_ar,
        description: input.description_ar,
        features: JSON.stringify({ category: input.category }),
        language_id: arabicLang.id
      }
    })

    revalidatePath('/dashboard/products')
    return product
  } catch (error) {
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
