import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import CategoryForm from '@/features/categories/components/category-form'
import { getCategoryById } from '@/features/categories/actions/category-actions'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Category'
}

export default async function EditCategoryPage({
  params
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  const category = await getCategoryById(parseInt(categoryId))

  if (!category) {
    notFound()
  }

  // Get the English title for display
  const englishTitle = category.translations?.find(t => t.language.code === 'en')?.name || 'Category'

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Category'
            description={`Edit the category: ${englishTitle}`}
          />
        </div>
        <Separator />
        <CategoryForm 
          initialData={category} 
          pageTitle='Edit Category'
        />
      </div>
    </PageContainer>
  )
}
