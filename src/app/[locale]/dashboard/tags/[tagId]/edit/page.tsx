import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import TagForm from '@/features/tags/components/tag-form'
import { getTagById } from '@/features/tags/actions/tag-actions'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Tag'
}

export default async function EditTagPage({
  params
}: {
  params: Promise<{ tagId: string }>
}) {
  const { tagId } = await params
  const tag = await getTagById(parseInt(tagId))

  if (!tag) {
    notFound()
  }

  // Get the English translation name for display
  const englishTranslation = tag.translations.find(t => t.language.code === 'en')
  const tagName = englishTranslation?.name || 'Tag'

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Tag'
            description={`Edit the tag: ${tagName}`}
          />
        </div>
        <Separator />
        <TagForm 
          initialData={tag} 
          pageTitle='Edit Tag'
        />
      </div>
    </PageContainer>
  )
}
