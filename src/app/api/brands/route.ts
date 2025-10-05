import { NextRequest, NextResponse } from 'next/server'
import { addBrand, getBrands } from '@/features/brands/actions/brand-actions'

export async function GET() {
  try {
    const brands = await getBrands()
    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const brand = await addBrand(body)
    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create brand' },
      { status: 500 }
    )
  }
}
