import PageContainer from '@/components/layout/page-container'
import { buttonVariants } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import ProductListingPage from '@/features/products/components/product-listing'
import { searchParamsCache } from '@/lib/searchparams'
import { cn } from '@/lib/utils'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { SearchParams } from 'nuqs/server'
import { Suspense } from 'react'
import { PrismaClient } from '@prisma/client'

export const metadata = {
  title: 'Services Management'
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const prisma = new PrismaClient()

  const services = await prisma.service.findMany({
    include: {
      ServiceDetails: {
        where: {
          language: {
            code: locale
          }
        }
      }
    }
  })

  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(resolvedSearchParams)
  
  const mappedProducts = services.map((service) => {
    const detail = service.ServiceDetails[0]
    return {
      id: service.id,
      image_url: service.image_url,
      price: Number(service.price_usd),
      name: detail?.name ?? '',
      description: detail?.description ?? ''
    }
  })

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Products'
            description='Manage products (Server side table functionalities.)'
          />
          <Link
            href='/en/dashboard/products/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 size-4' /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <ProductListingPage products={mappedProducts} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
