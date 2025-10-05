import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import BrandForm from '@/features/brands/components/brand-form'
import { getBrandById } from '@/features/brands/actions/brand-actions'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Brand'
}

export default async function EditBrandPage({
  params
}: {
  params: Promise<{ brandId: string }>
}) {
  const { brandId } = await params
  const brand = await getBrandById(parseInt(brandId))

  if (!brand) {
    notFound()
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Brand'
            description={`Edit the brand: ${brand.name}`}
          />
        </div>
        <Separator />
        <BrandForm initialData={brand} pageTitle='Edit Brand' />
      </div>
    </PageContainer>
  )
}
