import { NextRequest, NextResponse } from 'next/server'
import { addTag, getTags } from '@/features/tags/actions/tag-actions'

export async function GET() {
  try {
    const tags = await getTags()
    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tag = await addTag(body)
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create tag' },
      { status: 500 }
    )
  }
}
