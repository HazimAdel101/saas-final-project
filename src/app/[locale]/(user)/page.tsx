import { Button } from '@/components/ui/button'
import { Grid3X3, List } from 'lucide-react'
import ProductCard from '@/components/product-card'
import Link from 'next/link'
import { prisma } from '@/lib/db'
// If you get a type error here, make sure you have run: npx prisma generate
// and that @prisma/client is installed and up-to-date
import { getTranslations } from 'next-intl/server'

const filterCategories = [
  { id: 'most-popular', labelKey: 'filter.mostPopular' },
  { id: 'premium', labelKey: 'filter.premium' },
  { id: 'free', labelKey: 'filter.free' },
  { id: 'recently-added', labelKey: 'filter.recentlyAdded' }
]

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Fetch translations
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  // Fetch products and details for the current language
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

  // Example: filter by category (add your own logic)
  const selectedFilter = 'most-popular' // You can make this dynamic with client-side state if needed
  const viewMode = 'grid' as 'grid' | 'list' // You can make this dynamic with client-side state if needed

  // Map products to card props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredProducts = products.filter((product) => {
    // You can add your own filter logic here based on productDetails or other fields
    return true // Example: show all
  })

  const totalResults = filteredProducts.length

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='sticky top-16 z-40 border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
          {/* Filter Tabs */}
          <h1 className='text-5xl'>{t('title')}</h1>
          <div className='flex items-center justify-between'>
            <div className='flex space-x-1'>
              {filterCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedFilter === category.id ? 'default' : 'ghost'}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selectedFilter === category.id
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {t(category.labelKey)}
                </Button>
              ))}
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-500'>
                {t('resultsRange', {
                  start: 1,
                  end: totalResults,
                  total: products.length
                })}
              </span>
              <div className='flex items-center space-x-1'>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  className='p-2'
                  // onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  className='p-2'
                  // onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className='flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => {
              const details = product.productDetails[0]
              // Convert Decimal values to string for client components
              const originalPrice = product.price_usd?.toString() || ''
              const discountedPrice = product.discount_usd?.toString() || ''
              const savings = product.discount_usd?.toString() || ''
              return (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <ProductCard
                    name={details?.name || ''}
                    image={product.image_url}
                    isPremium={false} // Add your own logic
                    originalPrice={originalPrice}
                    discountedPrice={discountedPrice}
                    savings={savings}
                    description={details?.description || ''}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
