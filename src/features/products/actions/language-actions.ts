'use server'

import { prisma } from '@/lib/db'

export async function getLanguages() {
  return await prisma.language.findMany()
}
