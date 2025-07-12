import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create languages
  const english = await prisma.language.create({
    data: {
      name: 'English',
      code: 'en',
    },
  });

  const arabic = await prisma.language.create({
    data: {
      name: 'Arabic',
      code: 'ar',
    },
  });

  // Create products
  const chatGPT = await prisma.product.create({
    data: {
      price_usd: 20.0,
      price_ksa: 75.0,
      discount_usd: 15.0,
      discount_ksa: 56.0,
      image_url: 'https://example.com/chatgpt-image.jpg', // Use actual image URL
    },
  });

  const canva = await prisma.product.create({
    data: {
      price_usd: 12.0,
      price_ksa: 45.0,
      discount_usd: 10.0,
      discount_ksa: 37.5,
      image_url: 'https://example.com/canva-image.jpg', // Use actual image URL
    },
  });

  // Add product details for English
  await prisma.productDetail.createMany({
    data: [
      {
        product_id: chatGPT.id,
        name: 'ChatGPT',
        description: 'ChatGPT is an advanced AI chatbot that helps you with various tasks.',
        features: JSON.stringify([
          'Text generation',
          'Language understanding',
          'Code generation',
        ]),
        language_id: english.id,
      },
      {
        product_id: canva.id,
        name: 'Canva',
        description: 'Canva is a user-friendly design tool for creating stunning visuals.',
        features: JSON.stringify([
          'Templates for various designs',
          'Easy drag and drop interface',
          'Collaboration tools',
        ]),
        language_id: english.id,
      },
    ],
  });

  // Add product details for Arabic
  await prisma.productDetail.createMany({
    data: [
      {
        product_id: chatGPT.id,
        name: 'ChatGPT',
        description: 'ChatGPT هو روبوت دردشة ذكي يساعدك في العديد من المهام.',
        features: JSON.stringify([
          'توليد النصوص',
          'فهم اللغة',
          'توليد الأكواد',
        ]),
        language_id: arabic.id,
      },
      {
        product_id: canva.id,
        name: 'Canva',
        description: 'كانفا هو أداة تصميم سهلة الاستخدام لإنشاء تصاميم رائعة.',
        features: JSON.stringify([
          'قوالب لتصاميم مختلفة',
          'واجهة سحب وإفلات سهلة',
          'أدوات للتعاون',
        ]),
        language_id: arabic.id,
      },
    ],
  });

  console.log('Database has been seeded.');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
