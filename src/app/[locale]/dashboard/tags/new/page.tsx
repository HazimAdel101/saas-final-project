import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import TagForm from '@/features/tags/components/tag-form'

export const metadata = {
  title: 'Add New Tag'
}

export default async function NewTagPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Add New Tag'
            description='Create a new tag for your products. Provide names in both Arabic and English.'
          />
        </div>
        <Separator />
        <TagForm 
          initialData={null} 
          pageTitle='Add New Tag'
        />
      </div>
    </PageContainer>
  )
}
