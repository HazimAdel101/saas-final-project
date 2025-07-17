import { Product } from '@/constants/data'
import { fakeProducts } from '@/constants/mock-api'
import { searchParamsCache } from '@/lib/searchparams'
import { ProductListingClient } from './product-listing-client'

export default async function ProductListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page')
  const search = searchParamsCache.get('name')
  const pageLimit = searchParamsCache.get('perPage')
  const categories = searchParamsCache.get('category')

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  }

  const data = await fakeProducts.getProducts(filters)
  const totalProducts = data.total_products
  const products: Product[] = data.products

  return (
    <ProductListingClient products={products} totalProducts={totalProducts} />
  )
}
