import { NextRequest, NextResponse } from 'next/server'
import { addCategory, getCategories } from '@/features/categories/actions/category-actions'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = await addCategory(body)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: 500 }
    )
  }
}
