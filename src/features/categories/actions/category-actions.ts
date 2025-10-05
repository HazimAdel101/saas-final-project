'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface NewCategoryInput {
  title_en: string
  title_ar: string
  color: string
  // Separate titles for Arabic and English
}

export async function addCategory(input: NewCategoryInput) {
  try {
    // Get language IDs for English and Arabic
    let englishLangId: number;
    let arabicLangId: number;

    try {
      // First try to find English language
      const englishLang = await prisma.language.findUnique({
        where: { code: 'en' }
      });

      if (englishLang) {
        englishLangId = englishLang.id;
      } else {
        // Create English language if it doesn't exist
        const newEnglishLang = await prisma.language.create({
          data: { name: 'English', code: 'en' }
        });
        englishLangId = newEnglishLang.id;
      }

      // Then try to find Arabic language
      const arabicLang = await prisma.language.findUnique({
        where: { code: 'ar' }
      });

      if (arabicLang) {
        arabicLangId = arabicLang.id;
      } else {
        // Create Arabic language if it doesn't exist
        const newArabicLang = await prisma.language.create({
          data: { name: 'Arabic', code: 'ar' }
        });
        arabicLangId = newArabicLang.id;
      }
    } catch (error) {
      console.error("Error getting/creating languages:", error);
      // Default to IDs 1 and 2 if query fails
      englishLangId = 1; // Assuming English has ID 1
      arabicLangId = 2;  // Assuming Arabic has ID 2
    }

    // Create category with translations using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the main category record
      const category = await tx.category.create({
        data: {
          color: input.color
        }
      });

      // Create translations for both languages
      const [englishTranslation, arabicTranslation] = await Promise.all([
        tx.categoryTranslation.create({
          data: {
            category_id: category.id,
            language_id: englishLangId,
            name: input.title_en
          }
        }),
        tx.categoryTranslation.create({
          data: {
            category_id: category.id,
            language_id: arabicLangId,
            name: input.title_ar
          }
        })
      ]);

      return { 
        category, 
        translations: { englishTranslation, arabicTranslation } 
      };
    });

    revalidatePath('/dashboard/categories')
    return result
  } catch (error) {
    throw new Error(`Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateCategory(id: number, input: NewCategoryInput) {
  try {
    // Get language IDs
    const englishLang = await prisma.language.findUnique({ where: { code: 'en' } })
    const arabicLang = await prisma.language.findUnique({ where: { code: 'ar' } })

    if (!englishLang || !arabicLang) {
      throw new Error('Required languages not found')
    }

    // Update category with translations using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the main category record
      const category = await tx.category.update({
        where: { id },
        data: {
          color: input.color
        }
      });

      // Update or create translations for both languages
      const [englishTranslation, arabicTranslation] = await Promise.all([
        tx.categoryTranslation.upsert({
          where: {
            category_id_language_id: {
              category_id: id,
              language_id: englishLang.id
            }
          },
          update: {
            name: input.title_en
          },
          create: {
            category_id: id,
            language_id: englishLang.id,
            name: input.title_en
          }
        }),
        tx.categoryTranslation.upsert({
          where: {
            category_id_language_id: {
              category_id: id,
              language_id: arabicLang.id
            }
          },
          update: {
            name: input.title_ar
          },
          create: {
            category_id: id,
            language_id: arabicLang.id,
            name: input.title_ar
          }
        })
      ]);

      return { 
        category, 
        translations: { englishTranslation, arabicTranslation } 
      };
    });

    revalidatePath('/dashboard/categories')
    return result
  } catch (error) {
    throw new Error(`Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (error) {
    throw new Error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        translations: {
          include: {
            language: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    return categories
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getCategoryById(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
    return category
  } catch (error) {
    throw new Error(`Failed to fetch category: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getLanguages() {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { name: 'asc' }
    })
    return languages
  } catch (error) {
    throw new Error(`Failed to fetch languages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
