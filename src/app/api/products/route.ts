import { NextResponse } from 'next/server'
import {
  addProduct,
  NewProductInput
} from '@/features/products/actions/product-actions'

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as NewProductInput
    const product = await addProduct(input)
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
