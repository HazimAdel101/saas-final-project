import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create languages first
    console.log('Creating languages...')
    const englishLang = await prisma.language.create({
      data: { name: 'English', code: 'en' }
    }).catch(async () => {
      console.log('English language already exists')
      return await prisma.language.findUnique({ where: { code: 'en' } })
    })

    const arabicLang = await prisma.language.create({
      data: { name: 'Arabic', code: 'ar' }
    }).catch(async () => {
      console.log('Arabic language already exists')
      return await prisma.language.findUnique({ where: { code: 'ar' } })
    })

    console.log('✓ Languages ready')

    // Create brands
    console.log('Creating brands...')
    const brands = [
      { name: 'OpenAI', color: '#10A37F' },
      { name: 'Google', color: '#4285F4' },
      { name: 'Microsoft', color: '#00BCF2' }
    ]

    for (const brand of brands) {
      await prisma.brand.create({
        data: { name: brand.name, color: brand.color }
      }).catch(() => {
        console.log(`Brand "${brand.name}" already exists`)
      })
    }
    console.log('✓ Brands ready')

    // Create categories with translations
    console.log('Creating categories...')
    const categories = [
      {
        color: '#3B82F6',
        translations: {
          en: 'AI Tools',
          ar: 'أدوات الذكاء الاصطناعي'
        }
      },
      {
        color: '#10B981',
        translations: {
          en: 'Work',
          ar: 'العمل'
        }
      },
      {
        color: '#F59E0B',
        translations: {
          en: 'Productivity',
          ar: 'الإنتاجية'
        }
      },
      {
        color: '#EF4444',
        translations: {
          en: 'Creative',
          ar: 'إبداعي'
        }
      },
      {
        color: '#8B5CF6',
        translations: {
          en: 'Development',
          ar: 'التطوير'
        }
      }
    ]

    for (const category of categories) {
      await prisma.category.create({
        data: {
          color: category.color,
          translations: {
            create: [
              {
                language_id: englishLang!.id,
                name: category.translations.en
              },
              {
                language_id: arabicLang!.id,
                name: category.translations.ar
              }
            ]
          }
        }
      }).catch(() => {
        console.log(`Category "${category.translations.en}" already exists`)
      })
    }
    console.log('✓ Categories ready')

    // Create tags with translations
    console.log('Creating tags...')
    const tags = [
      {
        color: '#FF6B6B',
        translations: {
          en: 'Video Editing',
          ar: 'تحرير الفيديو'
        }
      },
      {
        color: '#4ECDC4',
        translations: {
          en: 'Image Editing',
          ar: 'تحرير الصور'
        }
      },
      {
        color: '#45B7D1',
        translations: {
          en: 'AI Tool',
          ar: 'أداة ذكاء اصطناعي'
        }
      },
      {
        color: '#96CEB4',
        translations: {
          en: 'Machine Learning',
          ar: 'التعلم الآلي'
        }
      },
      {
        color: '#FFEAA7',
        translations: {
          en: 'Data Analysis',
          ar: 'تحليل البيانات'
        }
      },
      {
        color: '#DDA0DD',
        translations: {
          en: 'Automation',
          ar: 'الأتمتة'
        }
      },
      {
        color: '#98D8C8',
        translations: {
          en: 'Cloud Computing',
          ar: 'الحوسبة السحابية'
        }
      },
      {
        color: '#F7DC6F',
        translations: {
          en: 'Web Development',
          ar: 'تطوير الويب'
        }
      },
      {
        color: '#BB8FCE',
        translations: {
          en: 'Mobile App',
          ar: 'تطبيق محمول'
        }
      },
      {
        color: '#85C1E9',
        translations: {
          en: 'Database',
          ar: 'قاعدة البيانات'
        }
      }
    ]

    for (const tag of tags) {
      await prisma.tag.create({
        data: {
          color: tag.color,
          translations: {
            create: [
              {
                language_id: englishLang!.id,
                name: tag.translations.en
              },
              {
                language_id: arabicLang!.id,
                name: tag.translations.ar
              }
            ]
          }
        }
      }).catch(() => {
        console.log(`Tag "${tag.translations.en}" already exists`)
      })
    }
    console.log('✓ Tags ready')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log('   - Languages: 2 (English, Arabic)')
    console.log('   - Brands: 3 (OpenAI, Google, Microsoft)')
    console.log('   - Categories: 5 (AI Tools, Work, Productivity, Creative, Development)')
    console.log('   - Tags: 10 (Video Editing, Image Editing, AI Tool, etc.)')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })