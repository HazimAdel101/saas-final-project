'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface NewBrandInput {
  name: string
  color: string
}

export async function addBrand(input: NewBrandInput) {
  try {
    const brand = await prisma.brand.create({
      data: {
        name: input.name,
        color: input.color
      }
    })

    revalidatePath('/dashboard/brands')
    return brand
  } catch (error) {
    throw new Error(`Failed to create brand: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateBrand(id: number, input: NewBrandInput) {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: input.name,
        color: input.color
      }
    })

    revalidatePath('/dashboard/brands')
    return brand
  } catch (error) {
    throw new Error(`Failed to update brand: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteBrand(id: number) {
  try {
    await prisma.brand.delete({
      where: { id }
    })

    revalidatePath('/dashboard/brands')
    return { success: true }
  } catch (error) {
    throw new Error(`Failed to delete brand: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { created_at: 'desc' }
    })
    return brands
  } catch (error) {
    throw new Error(`Failed to fetch brands: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getBrandById(id: number) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id }
    })
    return brand
  } catch (error) {
    throw new Error(`Failed to fetch brand: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
