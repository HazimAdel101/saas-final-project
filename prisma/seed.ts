import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create English language record
    const englishExists = await prisma.language.findUnique({
      where: { code: 'en' }
    })
    
    if (!englishExists) {
      await prisma.language.create({
        data: { name: 'English', code: 'en' }
      })
      console.log('Created English language record')
    } else {
      console.log('English language record already exists')
    }

    // Create Arabic language record
    const arabicExists = await prisma.language.findUnique({
      where: { code: 'ar' }
    })
    
    if (!arabicExists) {
      await prisma.language.create({
        data: { name: 'Arabic', code: 'ar' }
      })
      console.log('Created Arabic language record')
    } else {
      console.log('Arabic language record already exists')
    }

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error seeding languages:', error)
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