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
  title: 'Prouducts Management'
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

  const products = await prisma.product.findMany({
    include: {
      productDetails: {
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

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  // Map products to only include image_url, name, price, and description in the current locale
  const mappedProducts = products.map((product) => {
    const detail = product.productDetails[0]
    return {
      id: product.id,
      image_url: product.image_url,
      price: Number(product.price_usd),
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
            <IconPlus className='mr-2 h-4 w-4' /> Add New
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
