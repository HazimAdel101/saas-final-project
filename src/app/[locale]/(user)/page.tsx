import ProductCard from '@/components/product-card'
import { LoadingGrid } from '@/components/loading-skeleton'
import { prisma, testDatabaseConnection } from '@/lib/db'
import { Suspense } from 'react'

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // const t = await getTranslations({ locale, namespace: 'HomePage' })

  // Test database connection first with timeout
  let isDatabaseConnected = false
  try {
    isDatabaseConnected = await Promise.race([
      testDatabaseConnection(),
      new Promise<boolean>((resolve) => 
        setTimeout(() => resolve(false), 3000)
      )
    ])
  } catch (error) {
    isDatabaseConnected = false
  }
  
  // Fetch products and details for the current language with error handling
  let products: any[] = []
  if (isDatabaseConnected) {
    try {
      products = await prisma.product.findMany({
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
    } catch (error) {
      // Fallback to empty array if database query fails
      products = []
    }
  } else {
    products = []
  }

  const viewMode = 'grid' as 'grid' | 'list' // You can make this dynamic with client-side state if needed

  // Map products to card props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredProducts = products.filter((product) => {
    return true
  })

  return (
    <div className='min-h-screen'>
      <div className='mt-16 flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
          <Suspense fallback={<LoadingGrid />}>
            {filteredProducts.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  {locale === 'ar' ? 'لا توجد منتجات متاحة' : 'No products available'}
                </h2>
                <p className='text-gray-600 dark:text-gray-400 text-center max-w-md'>
                  {locale === 'ar' 
                    ? 'عذراً، لا توجد منتجات متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.'
                    : 'Sorry, no products are currently available. Please try again later.'
                  }
                </p>
              </div>
            ) : (
              <div
                className={`grid items-stretch gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product) => {
                  const details = product.productDetails[0]
                  // Convert Decimal values to string for client components based on locale
                  const isArabic = locale === 'ar'
                  const price = isArabic ? product.price_ksa : product.price_usd
                  const discount = isArabic ? product.discount_ksa : product.discount_usd
                  const originalPrice = price?.toString() || ''
                  const discountedPrice = discount?.toString() || ''
                  const savings = discount ? ((price - discount) * 100 / price).toFixed(0) + '% off' : ''
                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={details?.name || ''}
                      image={product.image_url}
                      isPremium={false} // Add your own logic
                      originalPrice={originalPrice}
                      discountedPrice={discountedPrice}
                      savings={savings}
                      description={details?.description || ''}
                      price={price || 0}
                    />
                  )
                })}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
