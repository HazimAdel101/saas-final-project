import { NextResponse } from 'next/server'
import {
  addProduct,
  NewProductInput
} from '@/features/products/actions/product-actions'

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as NewProductInput
    // eslint-disable-next-line no-console
    console.log('API route received payload:', input)
    const product = await addProduct(input)
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
