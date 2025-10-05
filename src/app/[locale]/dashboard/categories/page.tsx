import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import CategoryListing from '@/features/categories/components/category-listing'
import { getCategories } from '@/features/categories/actions/category-actions'
import { Suspense } from 'react'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'Categories Management'
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Categories'
            description='Manage your product categories and their organization.'
          />
          <Link
            href='/en/dashboard/categories/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 size-4' /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={5} filterCount={0} />
          }
        >
          <CategoryListing categories={categories} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
