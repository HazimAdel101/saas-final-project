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
  discount_usd?: number
  discount_ksa?: number
  imageUrl: string
  brand_id?: number
  category_ids: number[]
  tag_ids: number[]
}

export async function addProduct(input: NewProductInput) {
  try {
    // Get language IDs - create languages if they don't exist
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

    // Create product with translations and relations using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the main service record
      const service = await tx.service.create({
        data: {
          price_usd: input.price_usd,
          price_ksa: input.price_ksa,
          discount_usd: input.discount_usd || 0,
          discount_ksa: input.discount_ksa || 0,
          image_url: input.imageUrl,
          brand_id: input.brand_id
        }
      });

      // Create service details for both languages
      const [englishDetail, arabicDetail] = await Promise.all([
        tx.serviceDetail.create({
          data: {
            service_id: service.id,
            name: input.name_en,
            description: input.description_en,
            features: JSON.stringify({}),
            language_id: englishLangId
          }
        }),
        tx.serviceDetail.create({
          data: {
            service_id: service.id,
            name: input.name_ar,
            description: input.description_ar,
            features: JSON.stringify({}),
            language_id: arabicLangId
          }
        })
      ]);

      // Create service-category relations
      if (input.category_ids.length > 0) {
        await Promise.all(
          input.category_ids.map(categoryId =>
            tx.serviceCategory.create({
              data: {
                service_id: service.id,
                category_id: categoryId
              }
            })
          )
        );
      }

      // Create service-tag relations
      if (input.tag_ids.length > 0) {
        await Promise.all(
          input.tag_ids.map(tagId =>
            tx.serviceTag.create({
              data: {
                service_id: service.id,
                tag_id: tagId
              }
            })
          )
        );
      }

      return { 
        service, 
        details: { englishDetail, arabicDetail } 
      };
    });

    revalidatePath('/dashboard/products')
    return result
  } catch (error) {
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export interface UpdateProductInput {
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  price_usd: number
  price_ksa: number
  discount_usd?: number
  discount_ksa?: number
  imageUrl: string
  brand_id?: number
  category_ids: number[]
  tag_ids: number[]
}

export async function updateProduct(id: number, input: UpdateProductInput) {
  try {
    // Get language IDs
    const englishLang = await prisma.language.findUnique({ where: { code: 'en' } })
    const arabicLang = await prisma.language.findUnique({ where: { code: 'ar' } })

    if (!englishLang || !arabicLang) {
      throw new Error('Required languages not found')
    }

    // Update product with translations and relations using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the main service record
      const service = await tx.service.update({
        where: { id },
        data: {
          price_usd: input.price_usd,
          price_ksa: input.price_ksa,
          discount_usd: input.discount_usd || 0,
          discount_ksa: input.discount_ksa || 0,
          image_url: input.imageUrl,
          brand_id: input.brand_id
        }
      });

      // Update or create service details for both languages
      const [englishDetail, arabicDetail] = await Promise.all([
        tx.serviceDetail.upsert({
          where: {
            service_id_language_id: {
              service_id: id,
              language_id: englishLang.id
            }
          },
          update: {
            name: input.name_en,
            description: input.description_en,
            features: JSON.stringify({})
          },
          create: {
            service_id: id,
            name: input.name_en,
            description: input.description_en,
            features: JSON.stringify({}),
            language_id: englishLang.id
          }
        }),
        tx.serviceDetail.upsert({
          where: {
            service_id_language_id: {
              service_id: id,
              language_id: arabicLang.id
            }
          },
          update: {
            name: input.name_ar,
            description: input.description_ar,
            features: JSON.stringify({})
          },
          create: {
            service_id: id,
            name: input.name_ar,
            description: input.description_ar,
            features: JSON.stringify({}),
            language_id: arabicLang.id
          }
        })
      ]);

      // Update service-category relations
      // First, delete existing relations
      await tx.serviceCategory.deleteMany({
        where: { service_id: id }
      });
      
      // Then create new relations
      if (input.category_ids.length > 0) {
        await Promise.all(
          input.category_ids.map(categoryId =>
            tx.serviceCategory.create({
              data: {
                service_id: id,
                category_id: categoryId
              }
            })
          )
        );
      }

      // Update service-tag relations
      // First, delete existing relations
      await tx.serviceTag.deleteMany({
        where: { service_id: id }
      });
      
      // Then create new relations
      if (input.tag_ids.length > 0) {
        await Promise.all(
          input.tag_ids.map(tagId =>
            tx.serviceTag.create({
              data: {
                service_id: id,
                tag_id: tagId
              }
            })
          )
        );
      }

      return { 
        service, 
        details: { englishDetail, arabicDetail } 
      };
    });

    revalidatePath('/dashboard/products')
    return result
  } catch (error) {
    throw new Error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.service.delete({
      where: { id }
    })

    revalidatePath('/dashboard/products')
    return { success: true }
  } catch (error) {
    throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getProducts() {
  try {
    const services = await prisma.service.findMany({
      include: {
        ServiceDetails: {
          include: {
            language: true
          }
        },
        brand: true,
        categories: {
          include: {
            category: {
              include: {
                translations: {
                  include: {
                    language: true
                  }
                }
              }
            }
          }
        },
        tags: {
          include: {
            tag: {
              include: {
                translations: {
                  include: {
                    language: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    return services
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getProductById(id: number) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        ServiceDetails: {
          include: {
            language: true
          }
        },
        brand: true,
        categories: {
          include: {
            category: {
              include: {
                translations: {
                  include: {
                    language: true
                  }
                }
              }
            }
          }
        },
        tags: {
          include: {
            tag: {
              include: {
                translations: {
                  include: {
                    language: true
                  }
                }
              }
            }
          }
        }
      }
    })
    return service
  } catch (error) {
    throw new Error(`Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`)
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

export async function getBrandsForSelect() {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        color: true
      },
      orderBy: { name: 'asc' }
    })
    return brands
  } catch (error) {
    throw new Error(`Failed to fetch brands: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getCategoriesForSelect() {
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

export async function getTagsForSelect() {
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
