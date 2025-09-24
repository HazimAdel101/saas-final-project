import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create languages
  const english = await prisma.language.create({
    data: {
      name: 'English',
      code: 'en'
    }
  })

  const arabic = await prisma.language.create({
    data: {
      name: 'Arabic',
      code: 'ar'
    }
  })

  // Create products
  const chatGPT = await prisma.product.create({
    data: {
      price_usd: 20.0,
      price_ksa: 75.0,
      discount_usd: 15.0,
      discount_ksa: 56.0,
      image_url: '/products/chatgpt.jpeg'
    }
  })

  const canva = await prisma.product.create({
    data: {
      price_usd: 12.0,
      price_ksa: 45.0,
      discount_usd: 10.0,
      discount_ksa: 37.5,
      image_url: '/products/canva.jpeg'
    }
  })

  // Add product details for English
  await prisma.productDetail.create({
    data: {
      product_id: chatGPT.id,
      name: 'ChatGPT',
      description:
        'ChatGPT is an advanced AI chatbot that helps you with various tasks.',
      features:
        '["Text generation","Language understanding","Code generation"]',
      language_id: english.id
    }
  })

  await prisma.productDetail.create({
    data: {
      product_id: canva.id,
      name: 'Canva',
      description:
        'Canva is a user-friendly design tool for creating stunning visuals.',
      features:
        '["Templates for various designs","Easy drag and drop interface","Collaboration tools"]',
      language_id: english.id
    }
  })

  // Add product details for Arabic
  await prisma.productDetail.create({
    data: {
      product_id: chatGPT.id,
      name: 'ChatGPT',
      description: 'ChatGPT هو روبوت دردشة ذكي يساعدك في العديد من المهام.',
      features: '["توليد النصوص","فهم اللغة","توليد الأكواد"]',
      language_id: arabic.id
    }
  })

  await prisma.productDetail.create({
    data: {
      product_id: canva.id,
      name: 'Canva',
      description: 'كانفا هو أداة تصميم سهلة الاستخدام لإنشاء تصاميم رائعة.',
      features:
        '["قوالب لتصاميم مختلفة","واجهة سحب وإفلات سهلة","أدوات للتعاون"]',
      language_id: arabic.id
    }
  })

}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
