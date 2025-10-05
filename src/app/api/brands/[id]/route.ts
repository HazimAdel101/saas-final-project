import { NextRequest, NextResponse } from 'next/server'
import { updateBrand, deleteBrand, getBrandById } from '@/features/brands/actions/brand-actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await getBrandById(parseInt(id))
    
    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const brand = await updateBrand(parseInt(id), body)
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update brand' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteBrand(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete brand' },
      { status: 500 }
    )
  }
}
