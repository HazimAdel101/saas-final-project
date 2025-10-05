import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import BrandListing from '@/features/brands/components/brand-listing'
import { getBrands } from '@/features/brands/actions/brand-actions'
import { Suspense } from 'react'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'Brands Management'
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Brands'
            description='Manage your product brands and their visual identity.'
          />
          <Link
            href='/en/dashboard/brands/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 size-4' /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={4} rowCount={5} filterCount={0} />
          }
        >
          <BrandListing brands={brands} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
