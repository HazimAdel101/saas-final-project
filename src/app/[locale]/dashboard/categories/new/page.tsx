import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import CategoryForm from '@/features/categories/components/category-form'

export const metadata = {
  title: 'Add New Category'
}

export default async function NewCategoryPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Add New Category'
            description='Create a new category for your products. Provide titles in both Arabic and English.'
          />
        </div>
        <Separator />
        <CategoryForm 
          initialData={null} 
          pageTitle='Add New Category'
        />
      </div>
    </PageContainer>
  )
}
