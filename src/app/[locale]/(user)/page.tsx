import ProductCard from '@/components/product-card'
import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // const t = await getTranslations({ locale, namespace: 'HomePage' })

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
          <div
            className={`grid items-stretch gap-6 ${
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
