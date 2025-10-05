import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import BrandForm from '@/features/brands/components/brand-form'

export const metadata = {
  title: 'Add New Brand'
}

export default function NewBrandPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Add New Brand'
            description='Create a new brand for your products.'
          />
        </div>
        <Separator />
        <BrandForm initialData={null} pageTitle='Add New Brand' />
      </div>
    </PageContainer>
  )
}
