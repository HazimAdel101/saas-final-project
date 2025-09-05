import FormCardSkeleton from '@/components/form-card-skeleton'
import PageContainer from '@/components/layout/page-container'
import { Suspense } from 'react'
import ProductViewPage from '@/features/products/components/product-view-page'

export const metadata = {
  title: 'Dashboard : Product View'
}

export default async function Page({
  params
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ProductViewPage productId={productId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
