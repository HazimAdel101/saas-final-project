import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Languages
  await prisma.language.create({
    data: {
      name: 'English',
      code: 'en',
    },
  });

  await prisma.language.create({
    data: {
      name: 'Arabic',
      code: 'ar',
    },
  });

}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
