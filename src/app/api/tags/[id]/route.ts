import { NextRequest, NextResponse } from 'next/server'
import { updateTag, deleteTag, getTagById } from '@/features/tags/actions/tag-actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tag = await getTagById(parseInt(id))
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
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
    const tag = await updateTag(parseInt(id), body)
    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update tag' },
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
    await deleteTag(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
