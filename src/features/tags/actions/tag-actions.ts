'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface NewTagInput {
  name_en: string
  name_ar: string
  color: string
  // Separate names for Arabic and English
}


export async function addTag(input: NewTagInput) {
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

    // Create tag with translations using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the main tag record
      const tag = await tx.tag.create({
        data: {
          color: input.color
        }
      });

      // Create translations for both languages
      const [englishTranslation, arabicTranslation] = await Promise.all([
        tx.tagTranslation.create({
          data: {
            tag_id: tag.id,
            language_id: englishLangId,
            name: input.name_en
          }
        }),
        tx.tagTranslation.create({
          data: {
            tag_id: tag.id,
            language_id: arabicLangId,
            name: input.name_ar
          }
        })
      ]);

      return { 
        tag, 
        translations: { englishTranslation, arabicTranslation } 
      };
    });

    revalidatePath('/dashboard/tags')
    return result
  } catch (error) {
    throw new Error(`Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export interface UpdateTagInput {
  name_en: string
  name_ar: string
  color: string
}

export async function updateTag(id: number, input: UpdateTagInput) {
  try {
    // Get language IDs
    const englishLang = await prisma.language.findUnique({ where: { code: 'en' } })
    const arabicLang = await prisma.language.findUnique({ where: { code: 'ar' } })

    if (!englishLang || !arabicLang) {
      throw new Error('Required languages not found')
    }

    // Update tag with translations using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the main tag record
      const tag = await tx.tag.update({
        where: { id },
        data: {
          color: input.color
        }
      });

      // Update or create translations for both languages
      const [englishTranslation, arabicTranslation] = await Promise.all([
        tx.tagTranslation.upsert({
          where: {
            tag_id_language_id: {
              tag_id: id,
              language_id: englishLang.id
            }
          },
          update: {
            name: input.name_en
          },
          create: {
            tag_id: id,
            language_id: englishLang.id,
            name: input.name_en
          }
        }),
        tx.tagTranslation.upsert({
          where: {
            tag_id_language_id: {
              tag_id: id,
              language_id: arabicLang.id
            }
          },
          update: {
            name: input.name_ar
          },
          create: {
            tag_id: id,
            language_id: arabicLang.id,
            name: input.name_ar
          }
        })
      ]);

      return { 
        tag, 
        translations: { englishTranslation, arabicTranslation } 
      };
    });

    revalidatePath('/dashboard/tags')
    return result
  } catch (error) {
    throw new Error(`Failed to update tag: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteTag(id: number) {
  try {
    await prisma.tag.delete({
      where: { id }
    })

    revalidatePath('/dashboard/tags')
    return { success: true }
  } catch (error) {
    throw new Error(`Failed to delete tag: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        translations: {
          include: {
            language: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    return tags
  } catch (error) {
    throw new Error(`Failed to fetch tags: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getTagById(id: number) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
    return tag
  } catch (error) {
    throw new Error(`Failed to fetch tag: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
