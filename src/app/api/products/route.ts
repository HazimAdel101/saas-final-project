import { NextResponse } from 'next/server'
import {
  addProduct,
  NewProductInput
} from '@/features/productss/actions/products-actions'

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as NewProductInput
    // eslint-disable-next-line no-console
    console.log('API route received payload:', input)
    const product = await addProduct(input)
    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.error()
  }
}
