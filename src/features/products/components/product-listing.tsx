import { ProductListingClient } from './products-listing-client'
import { Product } from '@/constants/data'

export default async function ProductListingPage({
  products
}: {
  products: Product[]
}) {
  const totalProducts = products.length

  return (
    <ProductListingClient products={products} totalProducts={totalProducts} />
  )
}
