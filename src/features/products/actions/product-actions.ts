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

    // Get language IDs - create languages if they don't exist
    let englishLangId: number;
    let arabicLangId: number;

    try {
      // First try to find English language
      const englishLang = await prisma.$queryRaw`
        SELECT id FROM "Language" WHERE code = 'en' LIMIT 1
      `;

      if (Array.isArray(englishLang) && englishLang.length > 0) {
        englishLangId = englishLang[0].id;
      } else {
        // Create English language if it doesn't exist
        const newEnglishLang = await prisma.$queryRaw`
          INSERT INTO "Language" (name, code) VALUES ('English', 'en') RETURNING id
        `;
        englishLangId = Array.isArray(newEnglishLang) ? newEnglishLang[0].id : 1;
      }

      // Then try to find Arabic language
      const arabicLang = await prisma.$queryRaw`
        SELECT id FROM "Language" WHERE code = 'ar' LIMIT 1
      `;

      if (Array.isArray(arabicLang) && arabicLang.length > 0) {
        arabicLangId = arabicLang[0].id;
      } else {
        // Create Arabic language if it doesn't exist
        const newArabicLang = await prisma.$queryRaw`
          INSERT INTO "Language" (name, code) VALUES ('Arabic', 'ar') RETURNING id
        `;
        arabicLangId = Array.isArray(newArabicLang) ? newArabicLang[0].id : 2;
      }
    } catch (error) {
      console.error("Error getting/creating languages:", error);
      // Default to IDs 1 and 2 if query fails
      englishLangId = 1; // Assuming English has ID 1
      arabicLangId = 2;  // Assuming Arabic has ID 2
    }

    // Create ProductDetail for English
    await prisma.serviceDetail.create({
      data: {
        service_id: product.id,
        name: input.name_en,
        description: input.description_en,
        features: JSON.stringify({ category: input.category }),
        language_id: englishLangId
      }
    })

    // Create ProductDetail for Arabic
    await prisma.serviceDetail.create({
      data: {
        service_id: product.id,
        name: input.name_ar,
        description: input.description_ar,
        features: JSON.stringify({ category: input.category }),
        language_id: arabicLangId
      }
    })

    revalidatePath('/dashboard/products')
    return product
  } catch (error) {
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
