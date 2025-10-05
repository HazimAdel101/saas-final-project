import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import TagListing from '@/features/tags/components/tag-listing'
import { getTags } from '@/features/tags/actions/tag-actions'
import { Suspense } from 'react'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'Tags Management'
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Tags'
            description='Manage your product tags for better organization and filtering.'
          />
          <Link
            href='/en/dashboard/tags/new'
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
          <TagListing tags={tags} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
